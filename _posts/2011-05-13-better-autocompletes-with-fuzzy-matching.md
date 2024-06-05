--- 
title: Better autocompletes with Fuzzy Matching
slug: better-autocompletes-with-fuzzy-matching
date: 2011-05-13T00:00:00Z
---

This article is an introduction to Fuzzy Matching and how it can improve an Autocomplete widget. Fuzzy Matching is used to find the most appropriate strings into a set of strings, like finding "Sinatra" when you mispelled it "Senatra".

We will setup a Sinatra application displaying an Ajax autocomplete widget, which call the backend to have the best matching results, even if the match is not strictly equal.

## Fuzzy Matching ?

Fuzzy Matching, aka [Approximate String matching](https://secure.wikimedia.org/wikipedia/en/wiki/Approximate_string_matching) on Wikipedia, is used mainly in spell checkers and in biology to measure the variation between DNA.

In this article, we will use the [Levenshtein distance algorithm](https://secure.wikimedia.org/wikipedia/en/wiki/Levenshtein_distance) to fetch results when there would be none using standard methods. Some other matching algorithms are also popular: the [Damerau–Levenshtein distance](https://secure.wikimedia.org/wikipedia/en/wiki/Damerau%E2%80%93Levenshtein_distance) (Levenshtein with transposition of letters), the [Soundex](https://secure.wikimedia.org/wikipedia/en/wiki/Soundex) (a phonetic algorithm for indexing names by sound) and also the [Bitap](https://secure.wikimedia.org/wikipedia/en/wiki/Bitap_algorithm). Many of them can be found in Ruby, or could also be hand coded.

Using the Levenshtein algorithm, we get a distance between two strings. This gives for example :

```ruby
$ distance("sinatra", "sinatra") #= 0, equality
$ distance("sinatra", "senatra") #= 1, one permutation
$ distance("sinatra", "rails") #= 6, many permutation
```

This allows us to display to the user not only the strings that match the input, but also the strings that are approximately equal.

## The application

The application uses the following pieces of code :

* A Sinatra application
* JQuery UI for the Autocomplete
* The "text" gem which has an implementation of the Levenshtein distance algorithm (source: https://github.com/threedaymonk/text/blob/master/lib/text/levenshtein.rb)

The source code is available on : https://github.com/tomsquest/better-autocompletes-with-fuzzy-matching

### Frontend

The JQuery Autocomplete widget is simple to setup. The source is defined to call the "countries" URL and it will send it the input like "countries?term=my_input".

#### 1. Add an input

```html
<div class="ui-widget">
 <label for="country">Country:</label>
 <input id="country" />
</div>
```

#### 2. Bind the JS

```javascript
$(function() {
  $("#country").autocomplete({
    source: "countries",
    select: function( event, ui ) {
      $("#results").text("input was: '"+ this.value + "' and selection was: "+ ui.item.value);
    }
  });
});
```

### Backend

Even simpler, the backend is a simple get method which respond with JSON :

```ruby
get "/countries" do
 content_type :json
 find_countries(params[:term]).to_json
end
```

The real stuff is in the "find_countries" method :

```ruby
def find_countries(term)
  # Exact match
  countries = COUNTRIES.find{|c| c.downcase == term.downcase}.to_a

  # Partial match
  if countries.empty?
    countries = COUNTRIES.find_all{|c| c.downcase.include? term.downcase }

    # Here is where we call the distance method of the text gem. It computes the Levenshtein distance and
    # appends the results to the partial match done before
    max_distance = 5 # Should be tweaked
    countries += COUNTRIES.find_all{|c| distance(c, term) < max_distance}.sort_by{|c| distance(c, term) }

    countries.uniq!
  end

  countries
end
```

The find_countries method can serve as an example. It uses exact and partial matching and use the Levenshtein distance to add some more results. A real-world-awesome-production implementation would be different, by narrowing the results (less results, lower distance).

## Wrapping up

With a minimal mathematical background and a minimal technical setup (no indexing, no DB specific feature), we have boosted our autocomplete results.

We've seen how to setup a quick-and-simple sinatra app which computes on the Levenshtein distance on the backend. The Frontend was easily done using the JQuery UI Autocomplete widget.

For advanced use cases, we should improve the way we mix the Fuzzy-maching results with the strictly matching results. Switching to a better algorithm, or a set of algorithm (Longest common substring + Dameau-Levenshtein) could also be easily done.

`The complete source code is available on Github : https://github.com/tomsquest/better-autocompletes-with-fuzzy-matching
