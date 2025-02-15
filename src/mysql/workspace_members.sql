CREATE TABLE workspace_members(
	PRIMARY KEY (workspace_id, user_id), //clave primaria compuesta entre el id de workspace con el id de usuario (esto evita que se repita un mismo miembro en el mismo workspace)
    workspace_id INT,
    user_id INT,
    FOREIGN KEY (workspace_id) REFERENCES workspaces(_id),
    FOREIGN KEY (user_id) REFERENCES USERS(_id)
)