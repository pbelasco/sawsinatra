require 'rubygems'
require 'sinatra'
require 'json'
require 'rest_client'


DB = "#{ENV['CLOUDANT_URL']}/sawtest"

def get_or_post(path, opts={}, &block)
  get(path, opts, &block)
  post(path, opts, &block)
end


get_or_post '/' do
  
  
  if params.empty? == false then
    if params[:sawmessage].empty? == false then
      RestClient.post "#{DB}", {'body'=>"#{params[:sawmessage]}", 'userid'=>"999", 'time'=>[2,2,2011]}.to_json, :content_type => :json, :accept => :json
    end
  else
    puts "empty message motherfucker"
  end
  
  data = RestClient.get "#{DB}/_design/example/_view/viewall"
  puts "yeah"
  @result = JSON.parse(data)['rows']
   #do |row|
  #  puts row['key'] << row['value']
  #end
 erb :index
end

