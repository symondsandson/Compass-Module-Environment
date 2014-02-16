module Quill
  class Client
    class InvalidKeys < Exception ; end
    attr_accessor :token, :client, :config
    delegate :get, :post, :put, to: :token
    include EndpointDefinitions

    def initialize options = {}
      @config = Configuration.new(options, api_url: 'http://api.quill.org/')
      # raise ArgumentError, 'Missing access_token' if config.access_token.blank?
    end

    def token
      @token ||= OAuth2::AccessToken.new client, config.access_token
    end

    def client
      @client ||= OAuth2::Client.new(config.client_id, config.client_secret, site: config.api_url, raise_errors: false) do |conn|
        conn.request :json
        conn.response :json
        conn.adapter Faraday.default_adapter
      end
    end

    def get path, params = {}
      request :get, path, params
    end

    def post path, params = {}
      request :post, path, params
    end

    def put path, params = {}
      request :put, path, params
    end

    def request verb, path, params = {}
      key = if verb == :get then :params else :body end
      response = token.request verb, path, key => params
      raise response.error if response.status == 401
      response
    end

    class Endpoint
      attr_accessor :name, :api

      def initialize api, name, definition
        @api = api
        @name = name
        @attributes = definition['attributes'].keys
        @readonly_attributes = definition['readonly_attributes'].try(:keys) || []
      end

      def find id, params = {}
        check_keys(params)
        response = api.get([name,id].join('/'), params)
        Hashie::Mash.new(response.body['object'])
      end

      def create params
        check_keys(params)
        response = api.post(name, params)
        Hashie::Mash.new(response.body['object'])
      end

      def update id, params
        check_keys(params)
        response = api.put([name,id].join('/'), params)
        Hashie::Mash.new(response.body['object'])
      end

      def list
      end

      def check_keys params
        invalid_keys = params.stringify_keys.keys - @attributes - @readonly_attributes
        raise InvalidKeys, "Endpoint ##{name} does not support key(s) #{invalid_keys.join(', ')}" unless invalid_keys.empty?
      end
    end
  end

end
