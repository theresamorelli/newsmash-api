class Mash < ApplicationRecord
  def self.default_sources
    'the-new-york-times,bbc-news,the-economist,the-washington-post,the-wall-street-journal,fox-news,al-jazeera-english,politico,rt,reuters,associated-press,cnn,msnbc'
  end

  def self.filter_text(text)
    # Filter out news source names and other extra text
    text.gsub(/\WAP\W/, '').gsub(/[A-Z]{2,}[,]\s[a-zA-Z]{1,}./, '').gsub(/WASHINGTON/, '').gsub('Read Full Article at RT.com', '').gsub(/\WReuters\W/, '').gsub('-', ' ').gsub('\'s', '')
  end

  def self.getMashString(data)
    text = data.map do |story|
      desc = story.description
      # Add punctuation for better analytics
      desc + '.' if desc[-1,1] != '.' || desc [-1,1] != '?'
    end.join('')

    self.filter_text(text)
  end
end
