CREATE TABLE messages (
	_id INT AUTO_INCREMENT PRIMARY KEY,
    content TEXT(1000),
    sender INT NOT NULL,
    channel INT NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    modifiedAt TIMESTAMP,
    FOREIGN KEY (sender) REFERENCES USERS (_id),
    FOREIGN KEY (channel) REFERENCES channels (_id)
)