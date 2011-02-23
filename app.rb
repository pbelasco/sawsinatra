require 'rubygems'
require 'sinatra'
require 'json'
require 'rest_client'

require 'pusher'


Pusher.app_id = '4212'
Pusher.key = '26eaaa68d90c2a0cf4a7'
Pusher.secret = '70621f6f1c7bf223b1d5'

use Rack::Session::Cookie, :key => 'userid',
                           :domain => 'localhost',
                           :path => '/',
                           :expire_after => 94608000 # In seconds

local = true

if local == false then
  DB = "#{ENV['CLOUDANT_URL']}/sawtest"
else
  DB = "http://127.0.0.1:5984/isaw"
end

def get_or_post(path, opts={}, &block)
  get(path, opts, &block)
  post(path, opts, &block)
end


get_or_post '/' do

  #check is something has been POSTed  
  if params.empty? == false then
    if params[:sawmessage].empty? == false then
      if session.empty? == true then
          userid = rand(36**50).to_s(36)
          session["userid"] ||= userid
      else
          userid = session["userid"]   
            
      end
      
      #response.set_cookie("userid",{:value => "meh", :secure => true, :expire_after => Time.now + 94608000})
      #ret = request.cookies["userid"]
      puts " x and y values are #{params[:x]},#{params[:y]}"
      
      time = Time.new
      RestClient.post "#{DB}", {'body'=>"#{params[:sawmessage]}", 'userid'=>userid,  'x'=>"#{params[:x]}", 'y'=>"#{params[:y]}", 'time'=>[time.day, time.month, time.year, time.hour, time.min, time.sec]}.to_json, :content_type => :json, :accept => :json
      Pusher['test_channel'].trigger('my_event', "#{params[:sawmessage]},#{params[:x]},#{params[:y]}")
    end
  else
    puts "empty message motherfucker"
  end
  
  data = RestClient.get "#{DB}/_design/viewall/_view/viewall?limit=10&descending=true"
  puts "yeah"
  @result = JSON.parse(data)['rows']
   #do |row|
  #  puts row['key'] << row['value']
  #end
 erb :index
end

