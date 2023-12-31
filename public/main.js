async function getDNSRecords()
{
    console.log("getDNSRecords() called");
    try
    {
        let response = await fetch('/dns-records');

        const test = await response.json();

        console.log(test);
    } 
    catch (error)
    {
        console.error(error);
    }
}