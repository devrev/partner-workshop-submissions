## SpeedFusion Project Solution

1. API Endpoint used
`https://api.devrev.ai/internal/schemas.custom.set`

2. Payload used to create the Fields (Region and Sector), with the sector field dynamically dependent on the selected region

```
{
    "type": "tenant_fragment",
    "description": "Attributes for SpeedFusion",
    "leaf_type": "ticket",
    "fields": [
        {
            "name": "region",
            "field_type": "enum",
            "allowed_values": [
				"India", 
				"North America", 
				"United States"
			],
            "ui": { "display_name": "Region" }
        },
        {
            "name": "sector",
            "field_type": "enum",
            "allowed_values": [
				"Healthcare", 
				"Financial Services", 
				"Technology",
				"Manufacturing",
				"Retail"
			],
            "ui": { "display_name": "Sector" }
        }
    ],
	"conditions": [
        {
            "expression": "custom_fields.region == 'India'",
            "effects": [
                {
                    "fields": [ "custom_fields.sector" ],
					"allowed_values": [
						"Healthcare", 
						"Financial Services"
					]
                }
            ]
        },
		{
            "expression": "custom_fields.region == 'United States'",
            "effects": [
                {
                    "fields": [ "custom_fields.sector" ],
					"allowed_values": [
						"Technology",
						"Manufacturing"
					]
                }
            ]
        },
		{
            "expression": "custom_fields.region == 'North America'",
            "effects": [
                {
                    "fields": [ "custom_fields.sector" ],
					"allowed_values": [
						"Retail"
					]
                }
            ]
        }
    ]
}
```

3. Workflow created for the automation

![image](https://github.com/user-attachments/assets/5c5a35b8-725c-47e9-80fe-9d187525c479)

4. Region specific groups created and privileges configured accordingly

![image](https://github.com/user-attachments/assets/8dfca82a-4a4a-40a0-a3f8-5f94415373fa)

5. Working scenario of auto assigning the ticket to region specific group

![image](https://github.com/user-attachments/assets/49e6f800-470a-4f19-854f-e21451311bf5)

6. Dashboard
   
![image](https://github.com/user-attachments/assets/0c27f6d7-3644-4e7c-acce-ad0a6b23d33e)




