[![REUSE status](https://api.reuse.software/badge/github.com/SAP-samples/liteinventorymanagement)](https://api.reuse.software/info/github.com/SAP-samples/liteinventorymanagement)

# Welcome to Lite Inventory Management
Welcome to the sample use case of the Lite Inventory Management application. This open source application developed using the Cloud Application Programming Model (CAP) will help as reference for customers developing a lightweight inventory management system that can significantly streamline the processes of small to medium-sized enterprises by managing their local inventory databases efficiently. This system facilitates essential functions such as issuing goods, receiving goods, and monitoring stock levels. By automating these tasks, businesses can reduce human errors, optimize inventory turnover, and improve overall operational efficiency. Additionally, such a system can provide real-time inventory updates, enabling better decision-making regarding stock reordering and resource allocation. This leads to improved customer satisfaction through faster and more reliable service and can potentially reduce carrying costs by minimizing excess stock.

## Requirements
This solution utilizes BTP Services. Below are pre-requisite services for using this application. \
a. PostgreSQL on SAP BTP, hyperscaler \
b. SAP Application Logging Service for SAP BTP \
c. SAP Job Scheduling Service \
d. SAP BTP, Cloud Foundry Runtime

## Description
SAP ERP offers a comprehensive suite of inventory management functions that cater to wide range of business needs. For a MidMarket and Financial sectors who doesnt have complex manufacturing and Wareshouse Mangement Process
they can leverage light weight inventory application that can offer various functionalities that an enterprise inventory management application will have.  
Some of the key capabilities of Lite Inventory application includes 
1. Visibility to all local Inventory including stock levels
2. Perform Goods Receipt
3. Perform Goods Issue
4. Stock Level Reporting by Plant
5. Manage Inventory Manager Profile
6. Load Inventory Data


Sample View of ITK Lite Inventory Application

![Reference Image](/liteinventory.jpg)

## Database Requirement
Use the main GIT branch if you are using PostgreSQL as your database in BTP. If the database is HANA DB, convert the database HDB and also update MTA.YAML to deploy Multi Target Applications with HANA Database.

## Deploy the Application
Prior to running the package and deploy.

Step1: Go to app directory and run `npm i` command.\
Step2: Run the same command `npm i` under root directory as well.\
Step3: Run the following command to build and deploy the file to the SAP BTP, Cloud Foundry environment.

```
npm run mta:package:deploy
```

## Known Issues
No known Issues

## How to Get Support
[Create an issue](https://github.com/SAP-samples/liteinventorymanagement/issues) in this repository if you find a bug or have questions about the content.
 
For additional support, [ask a question in SAP Community](https://answers.sap.com/questions/ask.html).

## Contributing
If you wish to contribute code, or offer fixes and improvements, please send a pull request. Due to legal reasons, contributors will be asked to accept a DCO when they create the first pull request to this project. This happens in an automated fashion during the submission process. SAP uses [the standard DCO text of the Linux Foundation](https://developercertificate.org/).

## License
Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved. This project is licensed under the Apache Software License, version 2.0 except as noted otherwise in the [LICENSE](LICENSE) file.