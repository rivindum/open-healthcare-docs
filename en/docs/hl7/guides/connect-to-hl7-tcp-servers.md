---
sidebar_position: 2
title: "Connect to HL7 TCP servers"
description: This guide explains how to connect to HL7 TCP servers using the WSO2 Open Healthcare.
---

# Connect to HL7 TCP servers

This guide explains how to connect to HL7 TCP servers using the WSO2 Open Healthcare. The WSO2 Open Healthcare provides built-in capabilities to connect to HL7 TCP servers and send HL7 messages over the TCP. The TCP transport is commonly used to exchange HL7 messages between healthcare systems, such as hospital information systems (HIS), laboratory information systems (LIS), and electronic health record (EHR) systems.

:::note
These guides use [Ballerina](https://ballerina.io/), a language designed for integration and network services, to build healthcare integrations as microservices.
:::


The following example demonstrates how to connect to an HL7 TCP server using Ballerina HL7 client. 

## Step 1: Set Up Ballerina

Before you begin, ensure you have <a href="https://ballerina.io/downloads/installation-options/" target="_blank">Ballerina</a> installed on your system.

## Step 2: Implement the flow to connect to the HL7 TCP server

1. Create a Ballerina project using the following command. It will create the Ballerina project and the main.bal file can be used to implement the logic.

    ```bash
    $ bal new hl7_tcp_client_sample
    ```

2. Import the required modules to the Ballerina program and implement the logic to connect to the HL7 TCP server. In this sample, we are using the HL7v2.3 version. Therefore, we need to import the `ballerinax/health.hl7v23` package. If you are using a different version of HL7, you can import the relevant [package](https://central.ballerina.io/search?q=hl7&page=1&m=packages). Then QRY_A19 message is constructed and sent to the target HL7 server using Ballerina HL7 client. 

    ```ballerina
    import ballerinax/health.hl7v2;
    import ballerinax/health.hl7v23;
    import ballerina/io;

    public function main() returns error? {

        hl7v23:QRY_A19 qry_a19 = {
            msh: {
                msh3: {hd1: "ADT1"},
                msh4: {hd1: "MCM"},
                msh5: {hd1: "LABADT"},
                msh6: {hd1: "MCM"},
                msh8: "SECURITY",
                msh9: {cm_msg1: "QRY"},
                msh10: "MSG00001",
                msh11: {pt1: "P"},
                msh12: "2.3"
            },
            qrd: {
                qrd1: {ts1: "20220828104856+0000"},
                qrd2: "R",
                qrd3: "I",
                qrd4: "QueryID01",
                qrd7: {cq1: "5"},
                qrd8: [{xcn1: "1", xcn2: "ADAM", xcn3: "EVERMAN"}],
                qrd9: [{ce1: "VXI"}],
                qrd10: [{ce1: "SIIS"}]    
            }
        };

        hl7v2:HL7Client hl7client = check new("localhost", 59519);
        hl7v2:Message msg = check hl7client.sendMessage(qry_a19);
        io:println(string `Response : ${msg.toJsonString()}`);
    }
    ```

3. Run the Ballerina program using the following command.

    ```bash
    $ bal run
    ```

The Ballerina program connects to the HL7 TCP server and sends the QRY_A19 message. The response message received from the server should be printed to the console.