export const loginValidationSchema = {
    "id": "/login",
    "type": "object",
    "properties": {
        "email": {"type": "string"},
        "password": {"type": "string"}
    },
    "required": ["email", "password"]
}

export const registerValidationSchema = {
    "id": "/register",
    "type": "object",
    "properties": {
        "name": {"type": "string"},
        "email": {"type": "string"},
        "password": {"type": "string"},
        "image": {"type": "string"},
        "role": {"type": "string", "enum": ["User", "Admin"]},
    },
    "required": ["email", "password", "name", "role"]
}