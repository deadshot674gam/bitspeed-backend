import { Contact, LINKEDPRECEDENCE } from "../models/Contact";
import { Log } from "../utils/webservice.util";
import { AppDataSource } from "./webservice.db";
const LOGGER = new Log("webservice.service").logger

export const CONTACTS: Contact[] = []

export async function initCache() {
    let contacts = AppDataSource.getRepository(Contact)
    let contactsALL = await contacts.find()

    contactsALL.forEach((contact) => {
        CONTACTS.push(contact)
    })
}

export async function checkIfExistingPrimary(query: EQuery): Promise<boolean> {

    let findContacts = CONTACTS.filter((contact) => {
        return (contact["email"] === query["email"] && contact["linkPrecedence"] === LINKEDPRECEDENCE.PRIMARY) || (contact["phoneNumber"] === query["phoneNumber"] && contact["linkPrecedence"] === LINKEDPRECEDENCE.PRIMARY)
    })

    console.log(`This is output -> ${JSON.stringify(findContacts)}`)

    return findContacts !== null && findContacts.length > 0
}


export function duplicateExist(query: EQuery): boolean {
    return CONTACTS.filter((contact) => {
        return contact["email"] === query["email"] && contact["phoneNumber"] === query["phoneNumber"]
    }).length > 0
}


export async function insertDB(query: EQuery, isPrimary: boolean) {
    if (duplicateExist(query)) return;

    if(query["email"] === "garbage" || query["phoneNumber"] === "garbage") return;

    let contacts = AppDataSource.getRepository(Contact)
    if (isPrimary) {
        var contact: Contact = {
            email: query["email"],
            phoneNumber: query["phoneNumber"],
            linkedId: null,
            linkPrecedence: LINKEDPRECEDENCE.PRIMARY
        }
        console.log(`This is to be inserted -> ${JSON.stringify(contact)}`)

        CONTACTS.push(contact)
        await contacts.save(contact)

    } else {

        var primaryContact = await contacts.findOne({
            where: [
                {
                    email: query["email"],
                    linkPrecedence: LINKEDPRECEDENCE.SECONDARY
                },
                {
                    phoneNumber: query["phoneNumber"],
                    linkPrecedence: LINKEDPRECEDENCE.SECONDARY
                }
            ],
            order: {
                id: "ASC"
            }
        })

        if (primaryContact !== null && primaryContact["id"]) {
            LOGGER.info(JSON.stringify(primaryContact))
            var contact: Contact = {
                email: query["email"],
                phoneNumber: query["phoneNumber"],
                linkedId: primaryContact["id"],
                linkPrecedence: LINKEDPRECEDENCE.SECONDARY
            }
            console.log(`This is to be inserted -> ${JSON.stringify(contact)}`)
            CONTACTS.push(contact)
            await contacts.insert(contact)
        }

    }

}

export async function fetchRecords(query: EQuery): Promise<EResponse> {
    let contacts = AppDataSource.getRepository(Contact)

    var results = await contacts.find({
        where: [
            {
                phoneNumber: query["phoneNumber"]
            },
            {
                email: query["email"]
            }
        ],
        order: {
            linkPrecedence: "ASC"
        }
    })

    let response: EResponse = {
        emails: [],
        phoneNumbers: [],
        primaryContactId: null,
        secondaryContactIds: []
    }

    if (results !== null) {
        results.forEach((result) => {
            if (!response["emails"].includes(result["email"])) {
                response["emails"].push(result["email"])

            }
            if (!response["phoneNumbers"].includes(result["phoneNumber"])) {
                response["phoneNumbers"].push(result["phoneNumber"])
            }
            if (result["linkPrecedence"] === LINKEDPRECEDENCE.PRIMARY) {
                response["primaryContactId"] = Number(result["id"])
            } else {
                if(response["primaryContactId"]===null) {
                    response["primaryContactId"] = Number(result["linkedId"])
                }
                response["secondaryContactIds"].push(Number(result["id"]))
            }
        })
        LOGGER.info(JSON.stringify(results))

    }
    return response
}