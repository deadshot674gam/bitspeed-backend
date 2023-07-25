type EQuery = {
    email: string,
    phoneNumber: string
}

type EResponse = {
    primaryContactId: number|null,
    emails: string[], 
    phoneNumbers: string[], 
    secondaryContactIds: number[] 
}