const db = require("better-sqlite3")("./ui-inventory.sqlite");

console.log("\n=== Top 8 modules by element count ===");
console.table(db.prepare("SELECT module, files, components, elements FROM ui_modules ORDER BY elements DESC LIMIT 8").all());

console.log("\n=== Top 5 colliding ids (selector trap!) ===");
console.table(db.prepare("SELECT value, COUNT(*) AS uses, GROUP_CONCAT(DISTINCT module) AS modules FROM ui_elements WHERE kind='id' AND is_unique=0 GROUP BY value ORDER BY uses DESC LIMIT 5").all());

console.log("\n=== Unique data-testid in builder (safe selectors) ===");
console.table(db.prepare("SELECT component, value, line FROM ui_elements WHERE module='builder' AND kind='data-testid' AND is_unique=1 ORDER BY component, line LIMIT 15").all());

console.log("\n=== Components with zero unique selectors (high-risk pages) ===");
console.table(db.prepare(`
  SELECT module, component, COUNT(*) AS elements
  FROM ui_elements
  GROUP BY module, component
  HAVING SUM(is_unique) = 0
  ORDER BY elements DESC
  LIMIT 8
`).all());
