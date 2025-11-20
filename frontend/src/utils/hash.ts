export async function getHashKey(file: File, jobDescription: string) {
    const arrayBuffer = await file.arrayBuffer();
    const combined = new Uint8Array(
        arrayBuffer.byteLength + jobDescription.length
    );
    combined.set(new Uint8Array(arrayBuffer), 0);

    for (let i = 0; i < jobDescription.length; i++) {
        combined[arrayBuffer.byteLength + i] = jobDescription.charCodeAt(i);
    }

    const hashBuffer = await crypto.subtle.digest("SHA-256", combined);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}
