PRAGMA foreign_keys=OFF;
BEGIN TRANSACTION;
CREATE TABLE tasks (
	id VARCHAR NOT NULL, 
	original_name VARCHAR NOT NULL, 
	file_key VARCHAR NOT NULL, 
	file_type VARCHAR NOT NULL, 
	file_size INTEGER, 
	status VARCHAR, 
	progress INTEGER, 
	total_pages INTEGER, 
	created_at DATETIME DEFAULT (CURRENT_TIMESTAMP), 
	updated_at DATETIME, 
	completed_at DATETIME, 
	error_message TEXT, 
	PRIMARY KEY (id)
);
CREATE TABLE pages (
	id INTEGER NOT NULL, 
	task_id VARCHAR NOT NULL, 
	page_number INTEGER NOT NULL, 
	image_url VARCHAR NOT NULL, 
	thumbnail_url VARCHAR, 
	width INTEGER, 
	height INTEGER, 
	created_at DATETIME DEFAULT (CURRENT_TIMESTAMP), 
	PRIMARY KEY (id), 
	FOREIGN KEY(task_id) REFERENCES tasks (id)
);
COMMIT;
