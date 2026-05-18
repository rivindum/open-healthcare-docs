---
sidebar_position: 2
title: "Building FHIR Bundles"
description: FHIR Bundles are used to bundle multiple resources into a single request.
---

# Building FHIR Bundles

FHIR Bundles are used to bundle multiple resources into a single request. This guide explains how to build FHIR Bundles in WSO2 Open Healthcare. The WSO2 Open Healthcare provides a set of built-in capabilities to construct FHIR Bundles.

:::note
These guides use [Ballerina](https://ballerina.io/), a language designed for integration and network services, to build healthcare integrations as microservices.
:::


The following example demonstrates how to build a FHIR Bundle using Ballerina.

## Step 1: Set Up Ballerina

Before you begin, ensure you have <a href="https://ballerina.io/downloads/installation-options/" target="_blank">Ballerina</a> installed on your system. Follow the instructions in the [Installation Steps](../../install-and-setup/manual.md#ballerina-installation-steps)  to install Ballerina and set up the development environment.

## Step 2: Implement the logic to build the FHIR Bundle

1. Create a Ballerina project using the following command. It will create the Ballerina project and the main.bal file can be used to implement the logic.

    ```bash
    $ bal new fhir_bundle_sample
    ```
2. Import the required modules to the Ballerina program. In this sample, we are using the FHIR R4 module to build the FHIR Bundle. Therefore, we need to import the `ballerinax/health.fhir.r4` package.

    ```ballerina
    import ballerinax/health.fhir.r4.international401;
    import ballerinax/health.fhir.r4;
    import ballerina/io;
    ```
3. Implement the logic to initialize FHIR bundle and add FHIR resources to the bundle. In this sample, we are building a FHIR Bundle with a Patient and Observation resources.

    ```ballerina
    import ballerinax/health.fhir.r4.international401;
    import ballerinax/health.fhir.r4;
    import ballerina/io;

    public function main2() returns error? {
        // Initialize a bundle with desired type
        r4:Bundle bundle = { resourceType: "Bundle", 'type: "searchset"};
        r4:BundleEntry[] entries = []; 
        // Sample patient data
        international401:Patient patient = { resourceType: "Patient", id: "pat1", active: true };
        entries.push({ 'resource: patient });
        // Sample observation data
        international401:Observation observation = { resourceType: "Observation", id: "obx1", status: "final" ,code: { coding: [{ system: "http://loinc.org", code: "8480-6", display: "Systolic blood pressure"}]}};
        entries.push({ 'resource: observation });
        // Add the entries to the bundle
        bundle.entry = entries;
        io:println(bundle.toString());
    }            
    ```
## Step 3: Run the Ballerina Program

Run the Ballerina program using the following command:

    ```bash
    $ bal run
    ```
![FHIRBase connector](/assets/img/guildes/handling-fhir/fhir-base-connector.png)

