const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");

const deployInfoPath = path.join(__dirname, "data", "deploy-info.json");

function getDeployInfo() {
  const data = fs.readFileSync(deployInfoPath, "utf-8");
  return JSON.parse(data);
}

app.get("/", (req, res) => {
  const deployInfo = getDeployInfo();

  res.render("index", {
    appStatus: "UP",
    dbStatus: "UP",
    build: deployInfo.build,
    version: deployInfo.version,
    lastDeploy: deployInfo.lastDeploy
  });
});
app.post("/api/deploy-info", (req, res) => {
  const { build, version } = req.body;

  if (!build || !version) {
    return res.status(400).json({
      message: "build and version are required"
    });
  }

  const newDeployInfo = {
    build: build,
    version: version,
    lastDeploy: new Date().toLocaleString()
  };

  fs.writeFileSync(
    deployInfoPath,
    JSON.stringify(newDeployInfo, null, 2)
  );

  res.json({
    message: "Deployment info updated successfully"
  });
});


app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
