export async function Sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms))
}

export function extractValidationLink(emailText: string): string | null {
    // Regular expression to match Firebase auth verification URLs
    const regex = /https:\/\/[^"\s]+?\/auth\/action\?mode=verifyEmail&(?:amp;)?oobCode=[^"\s&]+&(?:amp;)?apiKey=[^"\s&]+[^"\s]*/;

    // Find the first match in the text
    const match = emailText.match(regex);

    if (!match) {
        return null;
    }

    // Clean up the URL by replacing HTML encoded ampersands
    const link = match[0].replace(/&amp;/g, '&');

    return link;
}