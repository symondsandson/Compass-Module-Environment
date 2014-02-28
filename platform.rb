require 'thor'
require 'hashie'
require './api/lib/quill/api.rb'

class QuillPlatform < Thor
  include Thor::Actions

  def self.source_root
    File.dirname(__FILE__)
  end

  desc 'generate_clients', 'generate Quill client for ruby'
  def generate_clients
    @version = File.read('version')

    directory('templates/clients/ruby', 'pkg/ruby-api-client')
  end

  desc 'deploy', 'deploy'
  def deploy
    threads = []

    threads << Thread.new do
      run 'cd quill && git push heroku-staging refactor:master'
    end

    threads << Thread.new do
      run 'cd api && git push heroku master'
    end

    threads << Thread.new do
      run 'cd questions-module && git push heroku master'
    end

    threads.map(&:join)

    puts 'Deploy finished.'
  end

  desc 'publish', 'publish'
  def publish
    threads = []

    threads << Thread.new do
      run 'cd quill && git push origin refactor'
    end

    threads << Thread.new do
      run 'cd api && git push'
    end

    threads << Thread.new do
      run 'cd questions-module && git push'
    end

    threads << Thread.new do
      run 'git push'
    end

    threads.map(&:join)

    puts 'Publish finished.'
  end

  desc 'publish_clients', 'publish_clients'
  def publish_clients
    generate_clients

    inside 'pkg/ruby-api-client' do
      run 'gem build quill-api-client.gemspec'
      run "gem push quill-api-client-#{@version}.gem"
    end
  end

  protected
end

QuillPlatform.start(ARGV)
