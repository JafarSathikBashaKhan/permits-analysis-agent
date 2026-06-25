# US-175825: Print Partner Implementation - White mail reminder

| Field | Value |
|-------|-------|
| **ID** | 175825 |
| **Type** | User Story |
| **Module** | Print |
| **State** | Done |
| **Assigned To** | Natarajan Arumugam  |
| **Tags** |  |

## Acceptance Criteria

**Prerequisite:** When the application is selected and invoke the send to print action 
Then the applications should be placed in the blob as PDF 
The external API will fetch the files from the sources [Blob storage here] and drop it in its destination. 
 
**Folder Structure:** 
Application Container -> Print -> Contract ID -> Permission Type -> Permission Name -> White mail reminder -> Send / Receive / Process / success or Failure 

- All the application should placed in the **"Send Folder"** as pdf format. 
- A job will pick up these files from "**Send Folder**" blob path and response from the print partner should put in the "**Receive Folder**". 
- If some of the record of the application in print execution is failed, that should be placed in the “**Failure Folder**”. 
- Successfully executed print application should be placed in the “**Success**** Folder**”.
