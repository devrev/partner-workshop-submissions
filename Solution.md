## GlobalTech Project Solution

1. All customer accounts must be filterable by department and location, with the location field dynamically dependent on the selected department.

API Endpoint:  POST https://api.devrev.ai/internal/schemas.custom.set
```
{
    "type": "tenant_fragment",
    "description": "Attributes for GlobalTech",
    "leaf_type": "ticket",
    "fields": [
        {
            "name": "department",
            "field_type": "enum",
            "allowed_values": [
                "Technical", 
                "Sales", 
                "Accounts"
            ],
            "ui": { "display_name": "Department" }
        },
        {
            "name": "location",
            "field_type": "enum",
            "allowed_values": [
                "Mumbai", 
                "Bangalore", 
                "Chennai",
                "Hyderabad",
                "Delhi"
            ],
            "ui": { "display_name": "Location" }
        }
    ],
    "conditions": [
        {
            "expression": "custom_fields.department == 'Technical'",
            "effects": [
                {
                    "fields": [ "custom_fields.location" ],
                    "allowed_values": [
                        "Mumbai", 
                        "Bangalore"
                    ]
                }
            ]
        },
        {
            "expression": "custom_fields.department == 'Sales'",
            "effects": [
                {
                    "fields": [ "custom_fields.location" ],
                    "allowed_values": [
                        "Chennai",
                        "Hyderabad"
                    ]
                }
            ]
        },
        {
            "expression": "custom_fields.department == 'Accounts'",
            "effects": [
                {
                    "fields": [ "custom_fields.location" ],
                    "allowed_values": [
                        "Delhi"
                    ]
                }
            ]
        }
    ]
}
```



![image](https://github.com/user-attachments/assets/d6958b9a-7f76-4cee-88fb-93a7444624fb)


Dynamically dependent Fields


![Screenshot 2025-02-18 214658](https://github.com/user-attachments/assets/da4ee643-024d-45b4-9e62-94ceb6ec9f0d)




![Screenshot 2025-02-18 214709](https://github.com/user-attachments/assets/20a27f49-0478-4d88-9c4e-10f8cdf4d37e)





![Screenshot 2025-02-18 214722](https://github.com/user-attachments/assets/1ecd2e73-54b5-4ae2-8a13-60ae3d2a1acf)





![Screenshot 2025-02-18 214732](https://github.com/user-attachments/assets/0e8743b7-57dd-4d1a-926b-08acf956b345)





2. Newly created conversations and tickets must be routed to department-specific groups of support agents in a load-balanced manner.


   ![image](https://github.com/user-attachments/assets/e107c95d-5945-42a2-8fd7-7f5fe0f29d2c)




 3.Each support agent should only have visibility into the tickets and conversations they own
 Group Privileges:



 ![image](https://github.com/user-attachments/assets/eda78b49-f77c-42b3-8570-1ec50562f7c3)

 

4.Automated creation of bar charts visualizing the distribution of conversations and tickets across various departments is needed



![Screenshot 2025-02-18 201336](https://github.com/user-attachments/assets/ba0a039f-2299-4ec5-a839-c8f7d7a3a501)




![Screenshot 2025-02-18 201314](https://github.com/user-attachments/assets/6552e658-cdd0-4bdb-aa8b-3a38edc3d4f7)





 


 







