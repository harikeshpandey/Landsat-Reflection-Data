const fs = require('fs').promises;  // Use fs promises API

let obj = { table: [] };  // Default structure

// Improved function to check if two objects are deeply equal
const isDeepEqual = (obj1, obj2) => {
  if (typeof obj1 === 'object' && typeof obj2 === 'object' && obj1 !== null && obj2 !== null) {
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);

    if (keys1.length !== keys2.length) return false;

    for (const key of keys1) {
      if (!isDeepEqual(obj1[key], obj2[key])) return false;
    }

    return true;
  } else {
    return obj1 === obj2;
  }
};

// Refactored `add_data` function using async/await
const add_data = async (data_notify) => {
  try {
    // Read the file content asynchronously
    let data = await fs.readFile("scripts/notifydb.json", 'utf-8');

    // If file content is empty, set to initial structure
    if (data.trim().length === 0) {
      obj = { table: [] };
    } else {
      obj = JSON.parse(data);
    }

    // If `table` is not defined, initialize it as an array
    if (!Array.isArray(obj.table)) {
      obj.table = [];
    }

    // Check for duplicates before adding
    const isDuplicate = obj.table.some((entry) => isDeepEqual(entry, data_notify));

    if (!isDuplicate) {
      // Push new data to the table if not a duplicate
      obj.table.push(data_notify);

      // Convert object back to JSON and write to the file asynchronously
      const json = JSON.stringify(obj, null, 2);
      await fs.writeFile('scripts/notifydb.json', json, 'utf-8');
      console.log("Data successfully saved to notifydb.json!");
      return ["Entry successfully added to the wheel !",200];
    } else {
      console.log("Duplicate entry found. Data not added.");
      return ["Duplicate entry found. Data not added.",406];
    }
  } catch (err) {
    console.log("Error occurred:", err);
    return [`Error occurred: ${err}`,406];
  }
};

module.exports = add_data;
