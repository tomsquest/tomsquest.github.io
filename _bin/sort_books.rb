require 'json'
require 'date'

# Load the JSON data from the file
file_path = '_data/books.json'
books = JSON.parse(File.read(file_path))

sorted_books = books.sort_by do |book|
  date = Date.strptime(book['date'] || '1970-01', '%Y-%m')

  volume = book['volume'] || '1'

  # Group by series instead of title
  title = book['series'] || book['title'] || ''

  [
    -date.to_time.to_i,
    title,
    -volume.to_i,
  ]
end

puts(sorted_books)

# Write the sorted books back to the file
File.write(file_path, JSON.pretty_generate(sorted_books))