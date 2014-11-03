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
            href: 'http://mydomain.com/',
            protocol: 'http',
            host: 'mydomain.com',
            hostname: 'mydomain.com',
            domain: 'mydomain',
            pathname: '/',
            path: '/',
            tld: 'com'
          }
        );

        assert.deepEqual(
          artoo.parsers.url('http://mydomain.com/test'),
          {
            href: 'http://mydomain.com/test',
            protocol: 'http',
            host: 'mydomain.com',
            hostname: 'mydomain.com',
            domain: 'mydomain',
            pathname: '/test',
            path: '/test',
            tld: 'com'
          }
        );

        assert.deepEqual(
          artoo.parsers.url('http://mydomain.com:8000/'),
          {
            href: 'http://mydomain.com:8000/',
            protocol: 'http',
            host: 'mydomain.com:8000',
            hostname: 'mydomain.com',
            domain: 'mydomain',
            pathname: '/',
            path: '/',
            port: 8000,
            tld: 'com'
          }
        );

        assert.deepEqual(
          artoo.parsers.url('mydomain.com/'),
          {
            host: 'mydomain.com',
            hostname: 'mydomain.com',
            domain: 'mydomain',
            href: 'mydomain.com/',
            pathname: '/',
            path: '/',
            tld: 'com'
          }
        );
      });

      it('should be able to parse complex urls.', function() {
        assert.deepEqual(
          artoo.parsers.url('http://192.168.0.1:8000/'),
          {
            href: 'http://192.168.0.1:8000/',
            protocol: 'http',
            host: '192.168.0.1:8000',
            hostname: '192.168.0.1',
            domain: '192.168.0.1',
            pathname: '/',
            path: '/',
            port: 8000
          }
        );

        assert.deepEqual(
          artoo.parsers.url('https://localhost:8000/example'),
          {
            href: 'https://localhost:8000/example',
            protocol: 'https',
            host: 'localhost:8000',
            hostname: 'localhost',
            domain: 'localhost',
            path: '/example',
            pathname: '/example',
            port: 8000
          }
        );

        assert.deepEqual(
          artoo.parsers.url('http://sub.mydomain.com/'),
          {
            href: 'http://sub.mydomain.com/',
            protocol: 'http',
            host: 'sub.mydomain.com',
            hostname: 'sub.mydomain.com',
            domain: 'mydomain',
            subdomains: ['sub'],
            pathname: '/',
            path: '/',
            tld: 'com'
          }
        );

        assert.deepEqual(
          artoo.parsers.url('http://sub2.sub1.mydomain.com/'),
          {
            href: 'http://sub2.sub1.mydomain.com/',
            protocol: 'http',
            host: 'sub2.sub1.mydomain.com',
            hostname: 'sub2.sub1.mydomain.com',
            domain: 'mydomain',
            subdomains: ['sub1', 'sub2'],
            pathname: '/',
            path: '/',
            tld: 'com'
          }
        );

        assert.deepEqual(
          artoo.parsers.url('http://sub3.sub2.sub1.mydomain.com/'),
          {
            href: 'http://sub3.sub2.sub1.mydomain.com/',
            protocol: 'http',
            host: 'sub3.sub2.sub1.mydomain.com',
            hostname: 'sub3.sub2.sub1.mydomain.com',
            domain: 'mydomain',
            subdomains: ['sub1', 'sub2', 'sub3'],
            pathname: '/',
            path: '/',
            tld: 'com'
          }
        );
      });

      it('should handle querystrings.', function() {

        assert.deepEqual(
          artoo.parsers.url('https://mydomain.com/example?test&param=yes'),
          {
            href: 'https://mydomain.com/example?test&param=yes',
            protocol: 'https',
            host: 'mydomain.com',
            hostname: 'mydomain.com',
            domain: 'mydomain',
            pathname: '/example',
            path: '/example?test&param=yes',
            search: '?test&param=yes',
            query: {
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
            href: 'http://mydomain.com/example#table',
            protocol: 'http',
            host: 'mydomain.com',
            hostname: 'mydomain.com',
            domain: 'mydomain',
            pathname: '/example',
            path: '/example#table',
            hash: '#table',
            tld: 'com'
          }
        );
      });

      it('should handle extensions.', function() {
        assert.deepEqual(
          artoo.parsers.url('http://mydomain.com/example.html'),
          {
            href: 'http://mydomain.com/example.html',
            protocol: 'http',
            host: 'mydomain.com',
            hostname: 'mydomain.com',
            domain: 'mydomain',
            pathname: '/example.html',
            path: '/example.html',
            tld: 'com',
            extension: 'html'
          }
        );
      });

      it('should handle authentification.', function() {
        assert.deepEqual(
          artoo.parsers.url('http://usr:pwd@mydomain.com/example.html'),
          {
            auth: {
              user: 'usr',
              password: 'pwd'
            },
            href: 'http://usr:pwd@mydomain.com/example.html',
            protocol: 'http',
            host: 'mydomain.com',
            hostname: 'mydomain.com',
            domain: 'mydomain',
            pathname: '/example.html',
            path: '/example.html',
            tld: 'com',
            extension: 'html'
          }
        );

        assert.deepEqual(
          artoo.parsers.url('http://usr@mydomain.com/example.html'),
          {
            auth: {
              user: 'usr'
            },
            href: 'http://usr@mydomain.com/example.html',
            protocol: 'http',
            host: 'mydomain.com',
            hostname: 'mydomain.com',
            domain: 'mydomain',
            pathname: '/example.html',
            path: '/example.html',
            tld: 'com',
            extension: 'html'
          }
        );
      });
    });
  });
}).call(this);
