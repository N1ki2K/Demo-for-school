{literal}<style type="text/css">

    #mail-content {
        background-color: white;
        border: 1px solid #EEE;
        padding: 20px;
        padding-top: 40px;
        margin: auto;
        max-width: 600px;
    }

    table {
        background-color: white;
        width: 100%;
    }

    h1 {
        font-size: 1.2em;
    }

    h2 {
        font-size: 1.1em;
    }

    table {
        border-spacing: 0;
    }

    table td{
        padding: 10px 10px 10px 0;
    }

    .table-summary td{
        text-align: right;
    }

    .table-summary .subtotal td{
        border-top: 1px solid silver;
    }

    .table-summary .total td{
        border-top: 4px double silver;
        font-weight: bold;
    }

</style>
{/literal}

<div id="mail-content">

    <p>
        Hello{if isset($data->order->billingaddress)} {$data->order->billingaddress->firstname} {$data->order->billingaddress->lastname}{/if}!
    </p>

    <p>
        Your order with the number {$data->order->documentnumber} has been shipped.
    </p>

    <div class="methodinformation">

        {if !empty($data->order->shipping->content)}
            <p class="shipping-content">
                {$data->order->shipping->content}
            </p>
        {/if}

    </div>
    <div style="clear:both"></div>

</div>