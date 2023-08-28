export type EQuery = {
    email: string,
    phoneNumber: string
}

export type EResponse = {
    primaryContactId: number|null,
    emails: string[], 
    phoneNumbers: string[], 
    secondaryContactIds: number[] 
}