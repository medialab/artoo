;(function(undefined) {

  /**
   * artoo parsers unit tests
   * =========================
   *
   */

  describe('artoo.parsers', function() {

    describe('url', function() {

      it('should be able to parse simple urls.', function() {

        assert.deepEqual(
          artoo.parsers.url('http://mydomain.com/'),
          {
            url: 'http://mydomain.com/',
            protocol: 'http',
            origin: 'mydomain.com',
            domain: 'mydomain',
            path: '/',
            fullPath: '/',
            tld: 'com'
          }
        );

        assert.deepEqual(
          artoo.parsers.url('http://mydomain.com/test'),
          {
            url: 'http://mydomain.com/test',
            protocol: 'http',
            origin: 'mydomain.com',
            domain: 'mydomain',
            path: '/test',
            fullPath: '/test',
            tld: 'com'
          }
        );

        assert.deepEqual(
          artoo.parsers.url('http://mydomain.com:8000/'),
          {
            url: 'http://mydomain.com:8000/',
            protocol: 'http',
            origin: 'mydomain.com',
            domain: 'mydomain',
            path: '/',
            fullPath: '/',
            port: 8000,
            tld: 'com'
          }
        );

        assert.deepEqual(
          artoo.parsers.url('mydomain.com/'),
          {
            origin: 'mydomain.com',
            domain: 'mydomain',
            url: 'mydomain.com/',
            path: '/',
            fullPath: '/',
            tld: 'com'
          }
        );
      });

      it('should be able to parse complex urls.', function() {
        assert.deepEqual(
          artoo.parsers.url('http://192.168.0.1:8000/'),
          {
            url: 'http://192.168.0.1:8000/',
            protocol: 'http',
            origin: '192.168.0.1',
            domain: '192.168.0.1',
            path: '/',
            fullPath: '/',
            port: 8000
          }
        );

        assert.deepEqual(
          artoo.parsers.url('https://localhost:8000/example'),
          {
            url: 'https://localhost:8000/example',
            protocol: 'https',
            origin: 'localhost',
            domain: 'localhost',
            fullPath: '/example',
            path: '/example',
            port: 8000
          }
        );

        assert.deepEqual(
          artoo.parsers.url('http://sub.mydomain.com/'),
          {
            url: 'http://sub.mydomain.com/',
            protocol: 'http',
            origin: 'sub.mydomain.com',
            domain: 'mydomain',
            subdomains: ['sub'],
            path: '/',
            fullPath: '/',
            tld: 'com'
          }
        );

        assert.deepEqual(
          artoo.parsers.url('http://sub2.sub1.mydomain.com/'),
          {
            url: 'http://sub2.sub1.mydomain.com/',
            protocol: 'http',
            origin: 'sub2.sub1.mydomain.com',
            domain: 'mydomain',
            subdomains: ['sub1', 'sub2'],
            path: '/',
            fullPath: '/',
            tld: 'com'
          }
        );

        assert.deepEqual(
          artoo.parsers.url('http://sub3.sub2.sub1.mydomain.com/'),
          {
            url: 'http://sub3.sub2.sub1.mydomain.com/',
            protocol: 'http',
            origin: 'sub3.sub2.sub1.mydomain.com',
            domain: 'mydomain',
            subdomains: ['sub1', 'sub2', 'sub3'],
            path: '/',
            fullPath: '/',
            tld: 'com'
          }
        );
      });

      it('should handle querystrings.', function() {

        assert.deepEqual(
          artoo.parsers.url('https://mydomain.com/example?test&param=yes'),
          {
            url: 'https://mydomain.com/example?test&param=yes',
            protocol: 'https',
            origin: 'mydomain.com',
            domain: 'mydomain',
            path: '/example',
            fullPath: '/example?test&param=yes',
            querystring: 'test&param=yes',
            params: {
              test: true,
              param: 'yes'
            },
            tld: 'com'
          }
        );
      });

      it('should handle hash.', function() {

        assert.deepEqual(
          artoo.parsers.url('http://mydomain.com/example#table'),
          {
            url: 'http://mydomain.com/example#table',
            protocol: 'http',
            origin: 'mydomain.com',
            domain: 'mydomain',
            path: '/example',
            fullPath: '/example#table',
            hash: 'table',
            tld: 'com'
          }
        );
      });
    });
  });
}).call(this);
