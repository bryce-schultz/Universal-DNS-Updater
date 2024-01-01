const providers_select = document.getElementById('providers-select');
const options_container = document.getElementById('options-container');
const submit_button = document.getElementById('submit-button');

document.body.addEventListener('load', populateProvidersSelect());
providers_select.addEventListener('change', showOptions);
submit_button.addEventListener('click', submit);

async function populateProvidersSelect()
{
    const providers = await getDNSProviders();

    providers.forEach(provider =>
    {
        let option = document.createElement('option');
        option.value = provider.name;
        option.innerHTML = provider.name;
        providers_select.appendChild(option);
    });
}

async function showOptions()
{
    if (providers_select.value === 'none')
    {
        options_container.innerHTML = '';
        return;
    }

    const providers = await getDNSProviders();

    let selected_provider = providers.find(provider => provider.name === providers_select.value);
    options_container.innerHTML = '';

    selected_provider.params.forEach(param =>
    {
        let container = document.createElement('div');
        container.className = 'mb-3';

        let label = document.createElement('label');
        label.className = 'form-label';
        label.htmlFor = param;
        label.innerHTML = param;

        let input = document.createElement('input');
        input.id = param;
        input.className = 'form-control';

        container.appendChild(label);
        container.appendChild(input);

        options_container.appendChild(container);
    });
}

async function submit()
{
    const providers = await getDNSProviders();
    let selected_provider = providers.find(provider => provider.name === providers_select.value);

    let data = 
    {
        name: document.getElementById('name-input').value,
        provider: selected_provider.name,
        params: {}
    };

    selected_provider.params.forEach(param =>
    {
        const value = document.getElementById(param).value;
        data.params[param] = value;
    });

    console.log(data);

    const response = await fetch('/dns-records/add', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });

    const response_json = await response.json();
    if (response_json.status === 'success')
    {
        window.location = '/';
    }
    else
    {
        alert('Failed to add provider');
    }
}