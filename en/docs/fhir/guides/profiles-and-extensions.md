---
sidebar_position: 15
title: "Profiles and Extensions"
description: FHIR profiles and extensions are one of the key components in a FHIR server implementation, allowing for the customization and refinement of standard FHIR resources to meet specific use cases and regulatory requirements.
---

# Profiles and Extensions

FHIR profiles and extensions are one of the key components in a FHIR server implementation, allowing for the customization and refinement of standard FHIR resources to meet specific use cases and regulatory requirements. FHIR profiles enable organizations to define constraints and extensions on standard resources, ensuring that data conforms to particular business or clinical needs. 
<br />Extensions provide the flexibility to add new elements or modify existing ones without deviating from the core FHIR specification. Together, profiles and extensions facilitate the creation of a robust, adaptable FHIR server that can accommodate a wide range of healthcare scenarios while maintaining interoperability with other systems.

:::note
These guides use [Ballerina](https://ballerina.io/), a language designed for integration and network services, to build healthcare integrations as microservices.
:::


Ballerina FHIR packages are designed to effectively handle FHIR profiles and extensions. By leveraging the language  features, developers can define profiled FHIR resources with precision, ensuring that custom constraints and extensions are accurately represented. 

## Step 1: Set Up Ballerina

Before you begin, ensure you have <a href="https://ballerina.io/downloads/installation-options/" target="_blank">Ballerina</a> installed on your system. Follow the instructions in the [Installation Steps](../../install-and-setup/manual.md#ballerina-installation-steps)  to install Ballerina and set up the development environment.

## Step 2: Implement the flow to populate a FHIR resource with an extension.

1. Create a new Ballerina project using the following command. It will create the Ballerina project and the `main.bal` file can be used to implement the logic.

    ```bash
    $ bal new fhir_profile_extension_sample
    ```

2. Import the required modules to the Ballerina program. In this sample, we are using the package for US Core FHIR IG and base FHIR package. Therefore, we need to import the `ballerinax/health.fhir.r4.uscore501` and `ballerinax/health.fhir.r4` packages.

    ```ballerina
    import ballerina/io;
    import ballerinax/health.fhir.r4;
    import ballerinax/health.fhir.r4.uscore501;
    ```
3. Implement the logic to populate a FHIR resource with a profile and extension. In this sample, we are populating a US core FHIR Patient resource with known US core extension and a custom extension.

    ```ballerina
    import ballerina/io;
    import ballerinax/health.fhir.r4;
    import ballerinax/health.fhir.r4.uscore501;

    public function main() returns error? {
        uscore501:USCorePatientProfile patient = {
            resourceType: "Patient",
            id: "pat1",
            active: true,
            identifier: [],
            gender: "male",
            name: []
        };
        uscore501:UsCoreBirthsex birthsex = {
            valueCode: "M",
            url: "http://hl7.org/fhir/us/core/StructureDefinition/us-core-birthsex"
        };
        // Initialize the extension array with the birthsex extension
        patient.extension = [birthsex];
        // Add a custom defined extension to the patient. You can use the dedicated extension type for your requirements
        // (i.e: StringExtension, BooleanExtension). 
        r4:StringExtension customSSNExt = {
            url: "http://hl7.org/fhir/us/core/StructureDefinition/us-core-ssn",
            valueString: "111-222-1221"
        };
        (<r4:Extension[]>patient.extension).push(customSSNExt);
        io:println(patient);
    }
    ```
## Step 3: Run the Ballerina Program

Run the Ballerina program using the following command:

    ```bash
    $ bal run
    ```

:::info
The Ballerina CLI is designed to accommodate domain-specific tools, one of which is the Ballerina [Health tool](https://ballerina.io/learn/health-tool/). This specialized tool enables the generation of a Ballerina FHIR package, which includes Ballerina record representations of FHIR resources and project templates tailored for any custom set of FHIR structure definitions. These definitions can encompass FHIR profiles, extended FHIR resources, and more. The generated Ballerina FHIR packages can be pushed to Ballerina Central and then imported into your Ballerina project, providing access to the FHIR resources and extensions defined in the package.
:::
![FHIRBase connector](/assets/img/guildes/handling-fhir/fhir-base-connector.png)

![Create Extension](/assets/img/guildes/handling-fhir/fhir-create-extension-op-mi.png)

