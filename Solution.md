## Project: AgileTech

1. All customer accounts must be filterable by division and team, with the team field dynamically dependent on the selected division. 

``` POST https://api.devrev.ai/internal/schemas.custom.set ```

```
{
    "type": "tenant_fragment",
    "description": "Attributes for IT Services",
    "leaf_type": "ticket",
    "fields": [
        {
            "name": "division",
            "field_type": "enum",
            "allowed_values": [
                "Cloud Services",
                "Security",
                "IT Support"
            ],
            "ui": { "display_name": "Division" }
        },
        {
            "name": "team",
            "field_type": "enum",
            "allowed_values": [
                "AWS",
                "Azure",
                "Google Cloud",
                "SOC Operations",
                "Penetration Testing",
                "Compliance",
                "L1 Support",
                "L2 Support",
                "L3 Escalations"
            ],
            "ui": { "display_name": "Team" }
        }
    ],
    "conditions": [
        {
            "expression": "custom_fields.division == 'Cloud Services'",
            "effects": [
                {
                    "fields": ["custom_fields.team"],
                    "allowed_values": [
                        "AWS",
                        "Azure",
                        "Google Cloud"
                    ]
                }
            ]
        },
        {
            "expression": "custom_fields.division == 'Security'",
            "effects": [
                {
                    "fields": ["custom_fields.team"],
                    "allowed_values": [
                        "SOC Operations",
                        "Penetration Testing",
                        "Compliance"
                    ]
                }
            ]
        },
        {
            "expression": "custom_fields.division == 'IT Support'",
            "effects": [
                {
                    "fields": ["custom_fields.team"],
                    "allowed_values": [
                        "L1 Support",
                        "L2 Support",
                        "L3 Escalations"
                    ]
                }
            ]
        }
    ]
}

```
Configuration

![image](https://github.com/user-attachments/assets/25ddef7a-ae81-4609-a814-2d8c3dfbf74b)

Dependent Fields

![image](https://github.com/user-attachments/assets/a86b28c3-564d-4ec0-8fca-95cfa59088b4)

![image](https://github.com/user-attachments/assets/1987dc0e-cbf4-4cb2-bef9-4849aaab9357)

![image](https://github.com/user-attachments/assets/b22aaf5a-2a6e-4e5f-9aff-3c12700953e6)

![image](https://github.com/user-attachments/assets/f3c756d5-b6f8-4324-a0d7-de31547f081f)

2. Newly created conversations and tickets must be routed to division-specific groups of support agents in a load-balanced manner.

Workflow 

![image](https://github.com/user-attachments/assets/54378643-a1ad-4197-84e7-8e692a93e4a2)

Cloud Services Division - Load Balancing

![image](https://github.com/user-attachments/assets/b11266af-1bad-43b1-a93b-40f6bf10c8ec)

Ticket Update (Groups and Owners based on Condition)

![image](https://github.com/user-attachments/assets/b6788aca-a13e-4e0b-9240-a6a7d0b2340e)

**Working of Automatic Ticket Assigment**

![image](https://github.com/user-attachments/assets/38d3aed0-ea61-46d0-a974-a466a882cbb9)


Each support agent should only have visibility into the tickets and conversations they own.

Groups

![image](https://github.com/user-attachments/assets/6dad8b50-9299-4250-bfaa-9310d05ae214)

Privileges Example

![image](https://github.com/user-attachments/assets/94ad323d-f678-43dc-8fda-fba692a87952)

3. Automated creation of pie charts visualizing the distribution of conversations and tickets across various divisions is needed.

Tickets by Division

![image](https://github.com/user-attachments/assets/e6fb1187-5e9e-4085-9ad4-1f72e19b62be)

Updated Report after new ticket creation

![image](https://github.com/user-attachments/assets/3f3e7ff6-5df3-487c-aa8d-f3148b7c6289)

Configuration for Tickets by Division

![image](https://github.com/user-attachments/assets/a5330245-1e32-4fb1-845b-1047f4a19e68)

Tickets by Team

![image](https://github.com/user-attachments/assets/cf003803-2f79-48c2-97ef-da16cf8fe37d)

Updated Report after new ticket creation

![image](https://github.com/user-attachments/assets/e1fe50dc-35e7-42c9-b26a-8955cb155ef6)
