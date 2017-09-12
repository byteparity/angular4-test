import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';

const credentialsKey = 'credentials';

@Injectable()
export class MainServiceService {

  private _credentials: any;

  constructor(
    private http: Http,
    private toastr: ToastrService,
    private translateService: TranslateService,
    private router: Router
  ) {
    this._credentials = JSON.parse(sessionStorage.getItem(credentialsKey) || localStorage.getItem(credentialsKey));
  }

  getCommand (): Observable<any> {
      const headers: Headers = new Headers();
      headers.append(
        'Authorization',
        'Basic ' + btoa(this._credentials['username'] + ':' + this._credentials['token']));
      headers.append('Content-Type', 'application/json');
      const options = new RequestOptions({ headers: headers });

      return this.http.get('/command', options)
                       .map((res: Response) => res.json())
                       .catch((res: Response) => {
                        this.handleError(res);
                        return Observable.throw(res.json());
                      });
  }

  getElement (): Observable<any> {
      const headers: Headers = new Headers();
      headers.append(
        'Authorization',
        'Basic ' + btoa(this._credentials['username'] + ':' + this._credentials['token']));
      headers.append('Content-Type', 'application/json');

      const options = new RequestOptions({ headers: headers });

      return this.http.post('/element', options)
                      .map((res: Response) => res.json())
                      .catch((res: Response) => {
                        this.handleError(res);
                        return Observable.throw(res.json());
                      });
  }

  getLink (): Observable<any> {
    const headers: Headers = new Headers();
    headers.append(
      'Authorization',
      'Basic ' + btoa(this._credentials['username'] + ':' + this._credentials['token']));
    headers.append('Content-Type', 'application/json');

    const options = new RequestOptions({ headers: headers });

    return this.http.post('/link', options)
                    .map((res: Response) => res.json())
                    .catch((res: Response) => {
                      this.handleError(res);
                      return Observable.throw(res.json());
                    });
  }

  handleError(_res: any) {
    if (_res.status === 401) {
      this.toastr.error(_res.status.toString(), _res.statusText);
      this.router.navigate(['/login'], { replaceUrl: true });
    }
    if (_res.status === 403) {
      this.toastr.error(_res.status.toString(), _res.statusText);
    }
    if (_res.status === 404) {
      this.toastr.error(_res.status.toString(), _res.statusText);
    }
    if (_res.status === 500) {
      this.toastr.error(_res.status.toString(), _res.statusText);
    }
  }

}
