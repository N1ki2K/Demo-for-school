export interface PageTemplate {
  id: string;
  name: string;
  description: string;
  preview: string;
  content: string;
}

export const pageTemplates: Record<string, PageTemplate> = {
  basic: {
    id: 'basic',
    name: 'Basic Content',
    description: 'Simple page with paragraphs and text content',
    preview: 'Simple text layout with paragraphs',
    content: `<div class="space-y-6">
  <p class="text-lg leading-relaxed">
    Welcome to our page. This is the main introduction paragraph where you can describe the page content.
  </p>
  <p class="text-lg leading-relaxed">
    Add more detailed information here. You can expand on the topic and provide additional context.
  </p>
  <p class="text-lg leading-relaxed">
    This is where you can conclude your content or add final thoughts.
  </p>
</div>`
  },

  articleWithImage: {
    id: 'articleWithImage',
    name: 'Article with Image',
    description: 'Article layout with hero image and structured content',
    preview: 'Content with large image and sections',
    content: `<div class="space-y-6">
  <p class="text-lg leading-relaxed">
    Introduction paragraph that sets up the context for your article.
  </p>
  
  <figure class="my-8">
    <img src="https://picsum.photos/1200/400?random=100" alt="Article hero image" class="w-full h-auto max-h-96 object-cover rounded-lg shadow-md" />
    <figcaption class="text-center text-sm text-gray-500 mt-2">
      Image caption goes here
    </figcaption>
  </figure>
  
  <p class="text-lg leading-relaxed">
    Main content paragraph after the image. Continue your story or information here.
  </p>
  
  <!-- Highlighted Section -->
  <div class="bg-blue-50 p-6 rounded-lg mt-8">
    <h2 class="text-2xl font-bold text-blue-900 mb-4">Important Information</h2>
    <ul class="space-y-2 text-gray-700">
      <li>• Key point number one</li>
      <li>• Key point number two</li>
      <li>• Key point number three</li>
    </ul>
  </div>
  
  <p class="text-lg leading-relaxed">
    Concluding paragraph to wrap up your article.
  </p>
</div>`
  },

  documentPage: {
    id: 'documentPage',
    name: 'Document Page',
    description: 'Formal document with sections, tables, and lists',
    preview: 'Structured layout with sections and tables',
    content: `<p class="mb-10">
  This document contains important information organized in clear sections below.
</p>

<div class="space-y-12">
  
  <section>
    <h2 class="text-2xl font-semibold text-brand-blue-dark mb-4 border-l-4 border-brand-gold pl-4">
      Main Section Title
    </h2>
    <div class="space-y-3 text-gray-700">
      <p>Section introduction paragraph.</p>
      <p><strong>Important Details:</strong></p>
      <ol class="list-decimal list-inside space-y-2 pl-4">
        <li>First important item</li>
        <li>Second important item</li>
        <li>Third important item</li>
      </ol>
    </div>
  </section>

  <section>
    <h2 class="text-2xl font-semibold text-brand-blue-dark mb-4 border-l-4 border-brand-gold pl-4">
      Schedule/Timeline
    </h2>
    <div class="overflow-x-auto">
      <table class="w-full text-left border-collapse">
        <thead class="bg-brand-blue-light text-white">
          <tr>
            <th class="p-3">Activity</th>
            <th class="p-3">Date/Deadline</th>
          </tr>
        </thead>
        <tbody>
          <tr class="border-b hover:bg-gray-50">
            <td class="p-3">First Activity</td>
            <td class="p-3">Date here</td>
          </tr>
          <tr class="border-b hover:bg-gray-50">
            <td class="p-3">Second Activity</td>
            <td class="p-3">Date here</td>
          </tr>
          <tr class="border-b hover:bg-gray-50">
            <td class="p-3">Third Activity</td>
            <td class="p-3">Date here</td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>

  <section>
    <h2 class="text-2xl font-semibold text-brand-blue-dark mb-4 border-l-4 border-brand-gold pl-4">
      Requirements
    </h2>
    <ul class="list-disc list-inside space-y-2 text-gray-700 pl-4">
      <li>First requirement</li>
      <li>Second requirement</li>
      <li>Third requirement</li>
    </ul>
  </section>
  
</div>`
  },

  galleryGrid: {
    id: 'galleryGrid',
    name: 'Gallery Grid',
    description: 'Image gallery with grid layout',
    preview: 'Grid of images with descriptions',
    content: `<p class="mb-12">
  Explore our image gallery below. Click on any image to view it in full size.
</p>

<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
  <div class="overflow-hidden rounded-lg shadow-md group">
    <img src="https://picsum.photos/600/400?random=101" alt="Gallery image 1" class="w-full h-64 object-cover transform group-hover:scale-110 transition-transform duration-500 ease-in-out" />
    <div class="p-4 bg-white">
      <h3 class="font-semibold text-brand-blue">Image Title 1</h3>
      <p class="text-sm text-gray-600">Description of the first image</p>
    </div>
  </div>

  <div class="overflow-hidden rounded-lg shadow-md group">
    <img src="https://picsum.photos/600/400?random=102" alt="Gallery image 2" class="w-full h-64 object-cover transform group-hover:scale-110 transition-transform duration-500 ease-in-out" />
    <div class="p-4 bg-white">
      <h3 class="font-semibold text-brand-blue">Image Title 2</h3>
      <p class="text-sm text-gray-600">Description of the second image</p>
    </div>
  </div>

  <div class="overflow-hidden rounded-lg shadow-md group">
    <img src="https://picsum.photos/600/400?random=103" alt="Gallery image 3" class="w-full h-64 object-cover transform group-hover:scale-110 transition-transform duration-500 ease-in-out" />
    <div class="p-4 bg-white">
      <h3 class="font-semibold text-brand-blue">Image Title 3</h3>
      <p class="text-sm text-gray-600">Description of the third image</p>
    </div>
  </div>

  <div class="overflow-hidden rounded-lg shadow-md group">
    <img src="https://picsum.photos/600/400?random=104" alt="Gallery image 4" class="w-full h-64 object-cover transform group-hover:scale-110 transition-transform duration-500 ease-in-out" />
    <div class="p-4 bg-white">
      <h3 class="font-semibold text-brand-blue">Image Title 4</h3>
      <p class="text-sm text-gray-600">Description of the fourth image</p>
    </div>
  </div>

  <div class="overflow-hidden rounded-lg shadow-md group">
    <img src="https://picsum.photos/600/400?random=105" alt="Gallery image 5" class="w-full h-64 object-cover transform group-hover:scale-110 transition-transform duration-500 ease-in-out" />
    <div class="p-4 bg-white">
      <h3 class="font-semibold text-brand-blue">Image Title 5</h3>
      <p class="text-sm text-gray-600">Description of the fifth image</p>
    </div>
  </div>

  <div class="overflow-hidden rounded-lg shadow-md group">
    <img src="https://picsum.photos/600/400?random=106" alt="Gallery image 6" class="w-full h-64 object-cover transform group-hover:scale-110 transition-transform duration-500 ease-in-out" />
    <div class="p-4 bg-white">
      <h3 class="font-semibold text-brand-blue">Image Title 6</h3>
      <p class="text-sm text-gray-600">Description of the sixth image</p>
    </div>
  </div>
</div>`
  },

  infoSections: {
    id: 'infoSections',
    name: 'Info Sections',
    description: 'Multiple highlighted sections with different backgrounds',
    preview: 'Colorful sections with highlights and lists',
    content: `<div class="space-y-6">
  <p class="text-lg leading-relaxed">
    This page contains multiple sections with important information organized by topics.
  </p>
  
  <!-- Blue Section -->
  <div class="bg-blue-50 p-6 rounded-lg mt-8">
    <h2 class="text-2xl font-bold text-blue-900 mb-4">Important Information</h2>
    <p class="text-gray-700 mb-4">
      This section contains crucial details that you should be aware of.
    </p>
    <ul class="space-y-2 text-gray-700">
      <li>• First important detail</li>
      <li>• Second important detail</li>
      <li>• Third important detail</li>
    </ul>
  </div>

  <!-- Green Section -->
  <div class="bg-green-50 p-6 rounded-lg mt-8">
    <h2 class="text-2xl font-bold text-green-900 mb-4">Success Stories</h2>
    <p class="text-gray-700 mb-4">
      Here we highlight our achievements and positive outcomes.
    </p>
    <ul class="space-y-2 text-gray-700">
      <li>• Achievement number one</li>
      <li>• Achievement number two</li>
      <li>• Achievement number three</li>
    </ul>
  </div>

  <!-- Yellow Section -->
  <div class="bg-yellow-50 p-6 rounded-lg mt-8 border-l-4 border-yellow-400">
    <h2 class="text-2xl font-bold text-yellow-900 mb-4">Important Notice</h2>
    <p class="text-gray-700">
      This is a highlighted notice or announcement that requires attention.
    </p>
  </div>

  <!-- Gray Section -->
  <div class="bg-gray-50 p-6 rounded-lg mt-8">
    <h2 class="text-2xl font-bold text-gray-900 mb-4">Additional Resources</h2>
    <div class="grid md:grid-cols-2 gap-4">
      <div>
        <h3 class="font-semibold text-brand-blue mb-2">Resource Category 1</h3>
        <ul class="space-y-1 text-gray-700">
          <li>• Resource item 1</li>
          <li>• Resource item 2</li>
          <li>• Resource item 3</li>
        </ul>
      </div>
      <div>
        <h3 class="font-semibold text-brand-blue mb-2">Resource Category 2</h3>
        <ul class="space-y-1 text-gray-700">
          <li>• Resource item 1</li>
          <li>• Resource item 2</li>
          <li>• Resource item 3</li>
        </ul>
      </div>
    </div>
  </div>
</div>`
  },

  contactForm: {
    id: 'contactForm',
    name: 'Contact/Form Page',
    description: 'Page with contact information and form layout',
    preview: 'Contact details with form structure',
    content: `<div class="space-y-8">
  <p class="text-lg leading-relaxed">
    Get in touch with us using the information below or fill out the contact form.
  </p>

  <div class="grid md:grid-cols-2 gap-8">
    <!-- Contact Information -->
    <div>
      <h2 class="text-2xl font-bold text-brand-blue mb-4">Contact Information</h2>
      <div class="space-y-4">
        <div class="flex items-start space-x-3">
          <div class="w-6 h-6 bg-brand-gold rounded-full flex-shrink-0 mt-1"></div>
          <div>
            <h3 class="font-semibold">Address</h3>
            <p class="text-gray-600">Your address here<br>City, Postal Code</p>
          </div>
        </div>
        
        <div class="flex items-start space-x-3">
          <div class="w-6 h-6 bg-brand-gold rounded-full flex-shrink-0 mt-1"></div>
          <div>
            <h3 class="font-semibold">Phone</h3>
            <p class="text-gray-600">+359 XX XXX XXXX</p>
          </div>
        </div>
        
        <div class="flex items-start space-x-3">
          <div class="w-6 h-6 bg-brand-gold rounded-full flex-shrink-0 mt-1"></div>
          <div>
            <h3 class="font-semibold">Email</h3>
            <p class="text-gray-600">contact@example.com</p>
          </div>
        </div>
        
        <div class="flex items-start space-x-3">
          <div class="w-6 h-6 bg-brand-gold rounded-full flex-shrink-0 mt-1"></div>
          <div>
            <h3 class="font-semibold">Working Hours</h3>
            <p class="text-gray-600">Monday - Friday: 8:00 AM - 5:00 PM</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Contact Form Placeholder -->
    <div>
      <h2 class="text-2xl font-bold text-brand-blue mb-4">Send us a Message</h2>
      <div class="bg-gray-50 p-6 rounded-lg">
        <p class="text-gray-600 mb-4">Contact form would be implemented here with proper backend integration.</p>
        <div class="space-y-4">
          <div class="bg-white p-3 rounded border text-gray-400">Your Name</div>
          <div class="bg-white p-3 rounded border text-gray-400">Your Email</div>
          <div class="bg-white p-3 rounded border text-gray-400">Subject</div>
          <div class="bg-white p-12 rounded border text-gray-400">Your Message</div>
          <div class="bg-brand-blue text-white p-3 rounded text-center">Send Message</div>
        </div>
      </div>
    </div>
  </div>

  <!-- Additional Information -->
  <div class="bg-blue-50 p-6 rounded-lg">
    <h3 class="text-xl font-bold text-blue-900 mb-3">Additional Information</h3>
    <p class="text-gray-700">
      Include any additional contact information, directions, or important notes here.
    </p>
  </div>
</div>`
  }
};