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

    td {
        vertical-align: top;
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

    .table-address {
        width: 100%;
    }

    .table-summary {
        width: 100%;
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

    .widerruf {
        width: 100%;
        border-top: 1px dashed silver;
        border-bottom: 1px dashed silver;
    }


</style>
{/literal}

<div id="mail-content">
    <p>
        Hello{if isset($data->order->billingaddress)} {$data->order->billingaddress->firstname} {$data->order->billingaddress->lastname}{/if}!
    </p>

    <p>
        Thank you for placing your order! We received your order at {$data->order->date|date_format} and we'll process it with the order number {$data->order->documentnumber}.
        Please find a list of your items below. We'll notice you about the shipment with a separate email.
        The ship-to address below is the one we'll use to send your order to. Usually this will take 2-3 weeks.

    </p>

    <div class="methodinformation">

        {if !empty($data->order->shipping->content)}
            <p class="shipping-content">
                {$data->order->shipping->content}
            </p>
        {/if}

        {if !empty($data->order->surcharge->content)}
            <p class="surcharge-content">
                {$data->order->surcharge->content}
            </p>
        {/if}

    </div>
    <div style="clear:both"></div>

    <h1>Your Items</h1>

    <table>
        <th>Count</th>
        <th>Price</th>
        <th>Format</th>
        <th>File</th>
        <th>Thumbnail</th>

        {foreach $data->order->imagelineitems as $lineitem}
            <tr>
                <td>
                    {$lineitem->quantity}
                </td>
                <td>
                    {$lineitem->price}
                    {if $lineitem->quantity>1}({$lineitem->singleprice}){/if}
                </td>
                <td>
                    {$lineitem->imagetype->name}
                </td>
                <td>
                    {$lineitem->foldername}/{$lineitem->filename}
                </td>
                <td>
                    <img src="{$lineitem->thumburl}">
                </td>
            </tr>
            {if !empty($lineitem->buyernote)}
                <tr>
                   <td colspan="5">{$lineitem->buyernote}</td>
                </tr>
            {/if}
        {/foreach}
    </table>

    <table class="table-summary">
        <tr class="subtotal">
            <td>
                Subtotal
            </td>
            <td>
                 {$data->order->subtotal}
            </td>
        </tr>
        {if isset($data->order->surcharge)}
        <tr>
            <td>
                {$data->order->surcharge->name}
            </td>
            <td>
                {$data->order->surcharge->price}
            </td>
        </tr>
        {/if}

        {if isset($data->order->shipping)}
        <tr>
            <td>
                {$data->order->shipping->name}
            </td>
            <td>
                {$data->order->shipping->price}
            </td>
        </tr>
        {/if}

        {if isset($data->order->payment)}
        <tr>
            <td>
                {$data->order->payment->name}
            </td>
            <td>
                {$data->order->payment->price}
            </td>
        </tr>
        {/if}


        <tr class="total">
            <td>
                Total:
            </td>
            <td>
                {$data->order->total}
            </td>
        </tr>

        {if isset($data->order->tax)}
        <tr class="total">
            <td colspan="2">
                Price contains {$data->order->tax} VAT.
            </td>
        </tr>
        {/if}


    </table>


    <table class="table-address">
        <tr>
            {if isset($data->order->billingaddress)}
            <td>
                <h2>Billing Address</h2>
                {if !empty($data->order->billingaddress->companyname)}{$data->order->billingaddress->companyname}<br>{/if}
                {$data->order->billingaddress->firstname} {$data->order->billingaddress->lastname}<br>
                {$data->order->billingaddress->address1}<br>
                {if !empty($data->order->billingaddress->address2)}{$data->order->billingaddress->address2}<br>{/if}
                {if !empty($data->order->billingaddress->address3)}{$data->order->billingaddress->address3}<br>{/if}
                {$data->order->billingaddress->zip} {$data->order->billingaddress->city}<br>
                {if !empty($data->order->billingaddress->state)}{$data->order->billingaddress->state}<br>{/if}
                {if !empty($data->order->billingaddress->country)}{$data->order->billingaddress->country}<br>{/if}
            </td>
            {/if}
            {if isset($data->order->shippingaddress)}
            <td>
                <h2>Shipping Address</h2>
                {$data->order->shippingaddress->firstname} {$data->order->shippingaddress->lastname}<br>
                {$data->order->shippingaddress->address1}<br>
                {if !empty($data->order->shippingaddress->address2)}{$data->order->shippingaddress->address2}<br>{/if}
                {if !empty($data->order->shippingaddress->address3)}{$data->order->shippingaddress->address3}<br>{/if}
                {$data->order->shippingaddress->zip} {$data->order->shippingaddress->city}<br>
                {if !empty($data->order->shippingaddress->state)}{$data->order->shippingaddress->state}<br>{/if}
                {if !empty($data->order->shippingaddress->country)}{$data->order->shippingaddress->country}<br>{/if}
            </td>
            {/if}
            {if !empty($data->order->payment->content)}
                <td>
                    <h2>Payment</h2>
                    <p>{$data->order->payment->content}</p>
                </td>
            {/if}
        </tr>
    </table>

    {if !empty($data->order->email)}
        <p class="basic-email"><strong>EMail</strong></p>
        <p>
            {$data->order->email|escape}
        </p>
    {/if}

    {if !empty($data->order->message)}
    <p><strong>Message</strong></p>
    <p>
        {$data->order->message|escape}
    </p>
    {/if}

    {if !empty($data->order->phone)}
    <p class="basic-phone"><strong>Phone</strong></p>
    <p>
        {$data->order->phone|escape}
    </p>
    {/if}

    {if !empty($data->order->billingaddress->taxid)}<br>
        <p class="basic-phone"><strong>VAT ID</strong></p>
        <p>
            {$data->order->billingaddress->taxid|escape}
        </p>
    {/if}

    <div class="widerruf">
        {$data->disclaimer}
    </div>

    <div class="contact">
        This mail was send by:<br><br>

        Peter Lustig<br>
        Hasengraben 5<br>
        15432 Hundstedt
    </div>

</div>