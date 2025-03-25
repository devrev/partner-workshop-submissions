## Project: InnovateNow

1. All customer accounts must be filterable by project and milestone, with the milestone field dynamically dependent on the selected project. 

``` POST https://api.devrev.ai/internal/schemas.custom.set ```

```
{
    "type": "tenant_fragment",
    "description": "Attributes for InnovateNow",
    "leaf_type": "ticket",
    "fields": [
        {
            "name": "project",
            "field_type": "enum",
            "allowed_values": [
                "App Dev",
                "ML",
                "Networking",
                "Fund raising"
            ],
            "ui": {
                "display_name": "Project"
            }
        },
        {
            "name": "milestone",
            "field_type": "enum",
            "allowed_values": [
                "req gather",
                "development",
                "deploy",
                "data collection",
                "model training",
                "validating",
                "documentation",
                "design",
                "testing",
                "initial outreach",
                "mid-campaign",
                "post-campaign"

            ],
            "ui": {
                "display_name": "Milestone"
            }
        }
    ],
    "conditions": [
        {
            "expression": "custom_fields.project == 'App Dev'",
            "effects": [
                {
                    "fields": [
                        "custom_fields.milestone"
                    ],
                    "allowed_values": [
                        "req gather",
                        "development",
                        "deploy"
                    ]
                }
            ]
        },
        {
            "expression": "custom_fields.project == 'ML'",
            "effects": [
                {
                    "fields": [
                        "custom_fields.milestone"
                    ],
                    "allowed_values": [
                        "data collection",
                        "model training",
                        "validating"
                    ]
                }
            ]
        },
        {
            "expression": "custom_fields.project == 'Networking'",
            "effects": [
                {
                    "fields": [
                        "custom_fields.milestone"
                    ],
                    "allowed_values": [
                        "documentation",
                        "design",
                        "testing"
                    ]
                }
            ]
        },
        {
            "expression": "custom_fields.project == 'Fund raising'",
            "effects": [
                {
                    "fields": [
                        "custom_fields.milestone"
                    ],
                    "allowed_values": [
                        "initial outreach",
                        "mid-campaign",
                        "post-campaign"
                    ]
                }
            ]
        }
    ]
}
```
Configuration

![Screenshot 2025-02-18 214535](https://github.com/user-attachments/assets/1d53d10d-f141-47e4-b904-cb4e68d98acf)


Dependent Fields

![Screenshot 2025-02-18 214714](https://github.com/user-attachments/assets/0d0c3eab-e7f3-428b-b528-911ae45d5f2f)


![Screenshot 2025-02-18 214806](https://github.com/user-attachments/assets/9232cf06-c052-42a3-a40b-5d4965f0a222)


![Screenshot 2025-02-18 214837](https://github.com/user-attachments/assets/c688c3c0-ce49-4420-be8c-2526787f2562)


![Screenshot 2025-02-18 214909](https://github.com/user-attachments/assets/b1c82002-6433-4370-a71b-26b7c8e3672e)


2. Newly created conversations and tickets must be routed to division-specific groups of support agents in a load-balanced manner.

Workflow 

![image](https://github.com/user-attachments/assets/51de9961-686b-4acc-b66d-87838c417fe4)

Ticket Update (Groups and Owners based on Condition)

![image](https://github.com/user-attachments/assets/84d4581f-da89-4b04-8ca1-6e3c395f3e2a)


Each support agent should only have visibility into the tickets and conversations they own.

Groups

![image](https://github.com/user-attachments/assets/63175807-0667-495d-8305-eb72600f4db5)

![image](https://github.com/user-attachments/assets/cd05e3bb-8282-4ee5-8592-e341f319b556)

![image](https://github.com/user-attachments/assets/d76c1a8a-1ee3-4b2d-9389-e7074ee7b626)

Privileges Example

![image](https://github.com/user-attachments/assets/c6abda97-023c-457c-95e7-9052c471461c)

3. Automated creation of pie charts visualizing the distribution of conversations and tickets across various divisions is needed.


Configuration for Tickets by Division

![image](https://github.com/user-attachments/assets/847fdb93-c674-4821-b32f-7f566758847c)

Bar Graph by Project

![Screenshot 2025-02-18 213631](https://github.com/user-attachments/assets/4cb4f7aa-d9ba-4176-8868-32f9b76792bc)


Updated Report after new ticket creation

![image](https://github.com/user-attachments/assets/422a16b8-9671-4fc8-8092-f59d95535382)


Bar Graph by Milestones

![image](https://github.com/user-attachments/assets/a8720565-4986-4621-b427-e0d8924bb31b)
