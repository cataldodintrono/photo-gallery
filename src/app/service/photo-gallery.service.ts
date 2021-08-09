import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";

@Injectable({
    providedIn: 'root'
})
export class PhotoGalleryService {
    protected baseUrl: string = environment.apiUrl;

    constructor(private http: HttpClient) {}

    getImage(placeholder: string): Observable<any> {
        return this.http.get(`${this.baseUrl}${placeholder}/top.json`);
    }

}