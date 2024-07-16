const fs = require("fs");
const { all } = require("../routes/dashboardRoutes");

// Files to store numbers
const files = {
  A: "fileA.txt",
  B: "fileB.txt",
  C: "fileC.txt",
  D: "fileD.txt",
};

function writeToFile(file, number) {
  return new Promise((resolve, reject) => {
    fs.appendFile(file, number + "\n", (err) => {
      if (err) {
        return reject(err);
      }
      resolve();
    });
  });
}

async function displayFiles() {
  const results = {};

  await Promise.all(
    Object.keys(files).map(async (key) => {
      const file = files[key];
      try {
        const data = await fs.promises.readFile(file, "utf8");
        results[key] = data.trim().split("\n").map(Number);
      } catch (err) {
        if (err.code !== "ENOENT") {
          console.error(`Error reading ${file}:`, err);
        } else {
          results[key] = [];
        }
      }
    })
  );

  return results;
}

async function checkAllFilesStatus() {
  // Check if all files have at least one number
  const filesWritten = await Promise.all(
    Object.values(files).map((file) => {
      return new Promise((resolve, reject) => {
        fs.readFile(file, "utf8", (err, data) => {
          if (err) {
            if (err.code === "ENOENT") {
              resolve(false);
            } else {
              reject(err);
            }
          } else {
            resolve(data.trim() !== "");
          }
        });
      });
    })
  );

  if (filesWritten.every(Boolean)) {
    return true;
  } else {
    return false;
  }
}

const getDashboard = async (req, res) => {
  const { number } = req.body;

  if (isNaN(number) || number < 1 || number > 25) {
    return res.status(400).json({ message: "Invalid input. Please enter a number between 1 and 25." });
  }

  const fileStatus = await checkAllFilesStatus();

  if (fileStatus) {
    const allNumbers = await displayFiles();
    return res
      .status(200)
      .json({ message: "All the files have numbers. You can't enter more numbers.", data: allNumbers });
  }

  const result = number * 7;

  if (result > 140) {
    fileToWrite = files.A;
  } else if (result > 100) {
    fileToWrite = files.B;
  } else if (result > 60) {
    fileToWrite = files.C;
  } else {
    fileToWrite = files.D;
  }

  try {
    await writeToFile(fileToWrite, number);

    res.status(200).json({ message: `Result is ${result}. Writing Numbers to file ${fileToWrite}` });
  } catch (err) {
    console.error("Error processing number:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const displayAll = async (req, res) => {
  const allNumbers = await displayFiles();
  res.status(200).json({ data: allNumbers });
};

module.exports = { getDashboard, displayAll };
