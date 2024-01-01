const submit_button = document.getElementById('submit-button');
const provider_name = document.getElementById('provider-name');
const provider_url = document.getElementById('provider-url');

submit_button.addEventListener('click', addProvider);

async function addProvider()
{
    const url = provider_url.value;
    const name = provider_name.value;

    if (url.length === 0 || name.length === 0)
    {
        alert('Please enter a valid URL and name');
        return;
    }

    let params = parseURL(url);

    if (params.length === 0)
    {
        alert('Please enter a valid URL');
        return;
    }

    let provider = new Provider(name, url, params);

    console.log(provider);

    const response = await fetch('/dns-providers/add', 
    {
        method: 'POST',
        headers: 
        {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(provider)
    });

    const data = await response.json();
    if (data.status === 'success')
    {
        window.location = '/';
    }
    else
    {
        alert('Failed to add provider');
    }
}

function parseURL(url)
{
    let result = [];

    let current_param = '';
    let parsing = false;

    for (let i = 0; i < url.length; i++)
    {
        if (url[i] === '[' && !parsing)
        {
            parsing = true;
        }
        else if (parsing && url[i] === ']')
        {
            result.push(current_param);
            current_param = '';
            parsing = false;
        }
        else if (parsing)
        {
            current_param += url[i];
        }
    }

    return result;
}