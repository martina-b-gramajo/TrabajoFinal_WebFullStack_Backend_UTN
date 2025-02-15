CREATE TABLE channels (
    _id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    workspace INT NOT NULL,
    createdBy INT NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    modifiedAt TIMESTAMP,
    FOREIGN KEY (workspace) REFERENCES workspaces(_id),
    FOREIGN KEY (createdBy) REFERENCES USERS(_id)
)