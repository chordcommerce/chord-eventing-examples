export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Contact Us</h1>
      <div className="max-w-xl space-y-6">
        <p className="text-lg">
          We would love to hear from you. Get in touch with us using the information below.
        </p>
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold mb-2">Email</h2>
            <p>support@example.com</p>
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-2">Phone</h2>
            <p>1-800-123-4567</p>
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-2">Address</h2>
            <p>123 Main Street<br />City, State 12345</p>
          </div>
        </div>
      </div>
    </div>
  )
}
