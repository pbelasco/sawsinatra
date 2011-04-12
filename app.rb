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

local = false

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
      
      msgid = rand(36**50).to_s(36)
      
      #response.set_cookie("userid",{:value => "meh", :secure => true, :expire_after => Time.now + 94608000})
      #ret = request.cookies["userid"]
      puts " body before being stored in couchDB is #{params}"
      
      time = Time.new
      #
      RestClient.post "#{DB}", {'_id' => msgid, 'body'=>"#{params[:sawmessage]}", 'userid'=>"#{params[:userid]}",  'x'=>"#{params[:x]}", 'y'=>"#{params[:y]}", 'time'=>[time.year, time.month, time.day, time.hour, time.min, time.sec] }.to_json, :content_type => :json, :accept => :json
      Pusher['test_channel'].trigger('my_event', {'id'=>"#{msgid}", 'msg'=>"#{params[:sawmessage]}", 'x'=>"#{params[:x]}", 'y'=>"#{params[:y]}" }.to_json)
    end
  else
    puts "empty message motherfucker"
  end
  
  data = RestClient.get "#{DB}/_design/viewall/_view/viewall?limit=50&descending=true"
  puts "yeah"
  @result = JSON.parse(data)['rows']
 
   #do |row|
  #  puts row['key'] << row['value']
  #end
 erb :index
end


post '/locupdate' do
  puts "push push"
   Pusher['test_channel'].trigger('locupdate', {'id'=>"#{params[:id]}", 'x'=>"#{params[:newX]}", 'y'=>"#{params[:newY]}" }.to_json)
end

post '/reply' do
  
  #get the rev number of the document we want to update
  data = JSON.parse (RestClient.get "#{DB}/#{params[:receiverId]}")
  data['msg'] = {'msgbody'=>"#{params[:msg]}",'senderid'=>"#{params[:senderId]}"}; 
  
  #RestClient.post "#{DB}/_design/addmsg/_update/addmsg/#{params[:receiverId]}?senderid=666&msg=#{params[:msg]}"
  
  RestClient.put "#{DB}/#{params[:receiverId]}", data.to_json, :content_type => :json, :accept => :json
  
  #RestClient.post "#{DB}", {'_id' => msgid, 'body'=>"#{params[:sawmessage]}", 'userid'=>"#{params[:userid]}",  'x'=>"#{params[:x]}", 'y'=>"#{params[:y]}", 'time'=>[time.day, time.month, time.year, time.hour, time.min, time.sec]}.to_json, :content_type => :json, :accept => :json
  
  
end


get '/messages' do
  
  userid = params[:userid]
  data = JSON.parse(RestClient.get "#{DB}/")
  
end








