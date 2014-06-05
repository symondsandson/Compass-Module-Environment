gem 'pry'
require 'pry'

def strip_quotes str
  str.sub(/\A['"]/, '').sub(/['"]\z/, '')
end

def check_quotes str
  (str[/\A['"]/] && str[/['"]\z/]) ? str : %Q{"#{str}"}
end

def ` str
  print "\n\n\n\n\n"
  puts " *** RUNNING CMD *** "
  puts ' '
  puts str
  puts ' '
  super
end

class Container
  attr_reader :name, :dir

  def initialize name, dir, db
    @name = name
    @dir  = dir
    env 'DATABASE_NAME' => db
  end

  def create
    `docker run #{env} --expose 3000 --name #{name} -v #{dir}:/data -w /data --link postgres:pg -P --rm d425959f044ed1 sh /docker-run`
  end

  def host_port
    `docker port #{name} 3000`.chomp.split(':').last
  end

  def run cmd
    cmd = "PATH=/.rbenv/bin:/.rbenv/shims:$PATH #{cmd}"
    `sudo nsenter --target $(docker inspect --format '{{.State.Pid}}' #{name}) --mount --uts --ipc --net --pid sh -- -lc #{cmd.inspect}`
  end

  def rails code
    run ". /database-url && rails r #{code.inspect}"
  end

  # def rbenv key = nil, value = nil
  #   envs = run('cat /data/.rbenv-vars').chomp.split("\n").map{|e| e.split('=', 2) }
  #   hash = Hash[*envs.flatten]

  #   return hash if key.nil?
  #   return hash[key] if value.nil?

  #   hash[key] = value
  #   run(%Q|echo #{hash.map{|k,v| "#{k}=#{v}" }.join("\n").inspect} > /data/.rbenv-vars|)
  # end

  def env key = nil, value = nil
    @env ||= {}
    pair = false

    if key.is_a?(Hash) && value.nil?
      pair = key
      key   = pair.keys.first
      value = pair.values.first
    end

    return @env.map{|k,v| "-e #{k}=#{v.inspect}"}.join(' ') if key.nil?
    return @env[key] if value.nil?

    @env[key] = value
    pair || value
  end

  def restart
    `docker restart #{name}`
  end
end

compass = Container.new 'compass-compass', '/home/quinn/quill-platform/Compass',       'compass'
api     = Container.new 'compass-api',     '/home/quinn/quill-platform/Compass-API',   'compass'
quill   = Container.new 'compass-quill',   '/home/quinn/quill-platform/Quill-Lessons', 'quill_lessons'

quill.env api.env compass.env 'PATH'       => '/.rbenv/bin:/.rbenv/shims:$PATH'
quill.env api.env compass.env 'APP_SECRET' => 'not_secret'

# api.env compass.env 'DATABASE_URL' => 'postgres://docker:docker@$PG_PORT_5432_TCP_ADDR:$PG_PORT_5432_TCP_PORT/compass'
# quill.env             'DATABASE_URL', 'postgres://docker:docker@$PG_PORT_5432_TCP_ADDR:$PG_PORT_5432_TCP_PORT/quill_lessons'

compass.create
api.create

quill.env 'QUILL_API_URL',       "http://localhost:#{api.host_port}/"
quill.env 'QUILL_CLIENT_ID',     'quill-lessons'
quill.env 'QUILL_CLIENT_SECRET', 'quill-lessons-non-secret'
quill.env 'QUILL_SITE_URL',      "http://localhost:#{compass.host_port}/"

quill.create

compass.rails <<-CODE
  d = Doorkeeper::Application.find_by_uid('quill-lessons') || Doorkeeper:Application.new

  d.attributes = {
    name:         'Quill Lessons Module',
    uid:          'quill-lessons',
    secret:       'quill-lessons-non-secret',
    redirect_uri: 'http://localhost:#{quill.host_port}/'
  }

  d.save!
CODE

# exec "docker attach compass-compass & docker attach compass-api & docker attach compass-quill"

# gem 'pry'
# require 'pry'
# binding.pry

puts 'fin.'