
CREATE TABLE IF NOT EXISTS employees (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    position VARCHAR(255) NOT NULL,
    salary DOUBLE NOT NULL,
    joinDate VARCHAR(255) NOT NULL,
    phone VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS loans (
    id VARCHAR(255) PRIMARY KEY,
    employeeId VARCHAR(255) NOT NULL,
    amount DOUBLE NOT NULL,
    remainingAmount DOUBLE NOT NULL,
    reason TEXT,
    status VARCHAR(50) NOT NULL,
    termMonths INT NOT NULL,
    requestDate VARCHAR(255) NOT NULL,
    startDate VARCHAR(255) NOT NULL,
    aiAnalysis TEXT,
    FOREIGN KEY (employeeId) REFERENCES employees(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS transactions (
    id VARCHAR(255) PRIMARY KEY,
    loanId VARCHAR(255) NOT NULL,
    amount DOUBLE NOT NULL,
    date VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL,
    FOREIGN KEY (loanId) REFERENCES loans(id) ON DELETE CASCADE
);
