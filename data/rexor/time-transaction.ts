export interface TimeTransaction {
    UID?: string,
    ProjectCompanyID: string,
    ProjectID: string,
    ProjectActivityID?: string,
    ResourceID: string,
    RegistrationDate: string,
    Number: number,
    InvoicedNumber: number,
    InvoiceText: string,
    Description: string,
    DescriptionInternal: string,
    Status: string,
    InvoiceStatus: string,
    Tag: string,
    ClassificationID?: string,
    TimeCodeUID?: string
}