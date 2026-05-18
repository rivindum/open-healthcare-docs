---
sidebar_position: 19
title: "Validation"
description: FHIR validation involves checking FHIR resources against defined profiles, extensions, and structure definitions to ensure that the data is accurate, consistent, and compliant with the expected formats and standards.
---

# Validation

 FHIR validation involves checking FHIR resources against defined profiles, extensions, and structure definitions to ensure that the data is accurate, consistent, and compliant with the expected formats and standards. It is a crucial process in ensuring that healthcare data adheres to the FHIR standard's rules and constraints. FHIR validation helps to identify errors, enforce data integrity, and maintain interoperability across different healthcare systems.

:::note
These guides use [Ballerina](https://ballerina.io/), a language designed for integration and network services, to build healthcare integrations as microservices.
:::


Validating a FHIR resource(s) in Ballerina is supported with the FHIR package. Following example demonstrates how to validate a FHIR Patient resource using Ballerina.

## Step 1: Set Up Ballerina

Before you begin, ensure you have <a href="https://ballerina.io/downloads/installation-options/" target="_blank">Ballerina</a> installed on your system. Follow the instructions in the [Installation Steps](../../install-and-setup/manual.md#ballerina-installation-steps)  to install Ballerina and set up the development environment.

## Step 2: Implement the flow to populate a FHIR resource

1. Create a new Ballerina project using the following command. It will create the Ballerina project and the `main.bal` file can be used to implement the logic.

    ```bash
    $ bal new fhir_validation_sample
    ```
2. Import the required modules to the Ballerina program.

    ```ballerina
    import ballerina/io;
    import ballerinax/health.fhir.r4;
    import ballerinax/health.fhir.r4.validator;
    ```
3. Implement the logic to validate the FHIR resources. In this sample, we are validating a sample FHIR json to FHIR Patient resource. We are using the `validate()` function to validate the FHIR resource. This sample demonstrates how to validate a FHIR Patient resource with an invalid birth date.

    ```ballerina
    import ballerina/io;
    import ballerinax/health.fhir.r4;
    import ballerinax/health.fhir.r4.validator;

    public function main() returns error? {

        json body = {
        "resourceType": "Patient",
        "id": "591841",
        "meta": {
            "versionId": "1",
            "lastUpdated": "2020-01-22T05:30:13.137+00:00",
            "source": "#KO38Q3spgrJoP5fa"
        },
        "identifier": [ {
            "type": {
            "coding": [ {
                "system": "http://hl7.org/fhir/v2/0203",
                "code": "MR"
            } ]
            },
            "value": "18e5fd39-7444-4b30-91d4-57226deb2c78"
        } ],
        "name": [ {
            "family": "Cushing",
            "given": [ "Caleb" ]
        } ],
        "birthDate": "jdlksjldjl"
        };

        r4:FHIRValidationError? validateFHIRResourceJson = validator:validate(body);

        if validateFHIRResourceJson is r4:FHIRValidationError {
            io:print(validateFHIRResourceJson);
        }
    }
    ```

## Step 3: Run the Ballerina Program

Run the Ballerina program using the following command:

    ```bash
    $ bal run
    ```
![FHIRBase connector](/assets/img/guildes/handling-fhir/fhir-base-connector.png)

