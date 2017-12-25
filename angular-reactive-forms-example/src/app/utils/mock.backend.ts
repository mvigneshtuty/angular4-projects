import { Http, BaseRequestOptions, Response, ResponseOptions, RequestMethod } from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';
 
export function mockBackendFactory(backend: MockBackend, options: BaseRequestOptions) {

    backend.connections.subscribe((connection: MockConnection) => {
      // setTimeout() function to simulate an asynchronous call 
      // to the server that takes 2 second. 
      setTimeout(() => {
        //
        // Mock implementation of /api/create-user
        //
        if (connection.request.url.endsWith('/api/create-user') && 
            connection.request.method === RequestMethod.Post) {
            console.log('request received by Mock');
            let body = JSON.parse(connection.request.getBody());

            if (body.userId === 'testuser' && body.password === 'test@123') {
              connection.mockRespond(new Response(
                new ResponseOptions({ 
                  status: 200, 
                  body: { responseCode: 'SUC',
                    respMessage: 'User created successfully'
                 }
                })
              ));
            } else {
              connection.mockRespond(new Response(
                new ResponseOptions({ 
                    status: 200, 
                    body: {
                          responseCode: 'ERR',
                          respMessage: 'User creation failed'
                      }
                })
              ));
            }
        }

      }, 2000);
    }); 
    return new Http(backend, options);
}
 
export let mockBackendProvider = {
    provide: Http,
    useFactory: mockBackendFactory,
    deps: [MockBackend, BaseRequestOptions]
};