require 'thor'
require './api/lib/quill/api.rb'

class QuillPlatform < Thor
  include Thor::Actions

  def self.source_root
    File.dirname(__FILE__)
  end

  desc 'generate_clients', 'generate Quill client for ruby'
  def generate_clients
    template('templates/ruby-client.tt', 'ruby-api-client/lib/quill/endpoint_definitions.rb')
  end

  protected
end

QuillPlatform.start(ARGV)
