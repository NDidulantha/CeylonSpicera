<x-mail::message>
# New enquiry: {{ $contactMessage->inquiry_type }}

<x-mail::table>
| | |
| :--- | :--- |
| Name | {{ $contactMessage->name }} |
| Email | {{ $contactMessage->email }} |
@if ($contactMessage->phone)
| Phone | {{ $contactMessage->phone }} |
@endif
@if ($contactMessage->company)
| Company | {{ $contactMessage->company }} |
@endif
@if ($contactMessage->subject)
| Subject | {{ $contactMessage->subject }} |
@endif
</x-mail::table>

{{ $contactMessage->message }}

<x-mail::button :url="rtrim(config('app.url'), '/').'/admin/contact-messages'">
View in admin panel
</x-mail::button>

Reply to this email to respond directly to {{ $contactMessage->name }}.
</x-mail::message>
