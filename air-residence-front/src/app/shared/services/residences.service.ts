import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, combineLatest, Observable, throwError} from 'rxjs';
import {ResidenceType} from '../interfaces/residence.type';
import {environment} from '../../../environments/environment';
import {catchError, map, retry, shareReplay, tap} from 'rxjs/operators';
import {LoadingService} from './loading.service';
import {Validators} from '@angular/forms';

export const editorConfig = {
  toolbar: [
    ['bold', 'italic', 'underline', 'strike'],
    ['blockquote', 'code-block'],
    [{ 'header': 1 }, { 'header': 2 }],
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    [{ 'size': ['small', false, 'large', 'huge'] }],
    [{ 'align': [] }],
    ['link', 'image']
  ]
};

@Injectable({ providedIn: 'root' })
export class ResidencesService {

  residences$: Observable<ResidenceType[]> = this.http.get<ResidenceType[]>(`${environment.API_BASE}/residence`)
    .pipe(
      tap((residences: ResidenceType[]) => {
        this.residencesDataSubject.next(residences);
        this.loader.hideLoading();
      }),
      shareReplay(1),
      catchError(this.handleError)
    )

  private selectedCategorySubject: BehaviorSubject<string> = new BehaviorSubject<string>("Të gjitha");
  selectedCategoryAction$: Observable<string> = this.selectedCategorySubject.asObservable();

  private searchInputSubject: BehaviorSubject<string> = new BehaviorSubject<string>("");
  searchInputAction$: Observable<string> = this.searchInputSubject.asObservable();


  select(residence: string) {
    this.selectedCategorySubject.next(residence);
  }

  onInput(value: string) {
    this.searchInputSubject.next(value);
  }

  handleError(error: Error): Observable<never> {
    return throwError(error.message)
  }

  private residencesDataSubject: BehaviorSubject<ResidenceType[]> = new BehaviorSubject<ResidenceType[]>(null);
  residencesDataAction$: Observable<ResidenceType[]> = this.residencesDataSubject.asObservable();

  private selectedResidenceSubject: BehaviorSubject<string> = new BehaviorSubject<string>('');
  selectedResidenceAction$ = this.selectedResidenceSubject.asObservable();

  filteredResidences$ = combineLatest([this.residencesDataAction$,this.selectedCategoryAction$,this.searchInputAction$])
    .pipe(
      map(([residences,selectedCategory,searchInput]: [ResidenceType[],string,string]) => {
        let filtered: ResidenceType[] = residences;
        if (selectedCategory !== 'Të gjitha') {
          filtered = residences.filter((residence: ResidenceType) => residence.category === selectedCategory &&
            residence.title.toLowerCase().includes(searchInput?.toLowerCase()));
        }
        else if (searchInput.length > 0) {
          filtered = residences.filter((residence: ResidenceType) => residence.title.toLowerCase().includes(searchInput.toLowerCase()))
        }
        return filtered;
      })
    )

  residenceDetails$ = combineLatest([this.residencesDataAction$,this.selectedResidenceAction$])
    .pipe(
      map(([residences,residenceId]: [ResidenceType[],string]) => {
        return residences.find(residence => residence.id === residenceId)
      }),
    )

  selectResidence(residenceId: string): void {
    this.selectedResidenceSubject.next(residenceId);
  }

  add(data: FormData): Observable<ResidenceType> {
    return this.addResidence(data).pipe(
      tap((residence: ResidenceType) => {
        this.residencesDataSubject.next([...this.residencesDataSubject.value,residence])
      })
    )
  }

  delete(residence: ResidenceType): Observable<Object> {
    return this.deleteResidence(residence).pipe(
      tap(() => {
        const residences = this.residencesDataSubject.value.filter((res: ResidenceType) => res.id !== residence.id);
        this.residencesDataSubject.next(residences);
      }),
      catchError(this.handleError)
    );
  }

  update(id: string,data: FormData): Observable<ResidenceType> {
    return this.updateResidence(id,data).pipe(
      tap((residence: ResidenceType) => {
        const edited = this.residencesDataSubject.value.filter((residence: ResidenceType) => residence.id !== id);
        this.residencesDataSubject.next([...edited,residence])
      })
    )
  }

  deleteResidence(residence: ResidenceType): Observable<Object> {
    return this.http.delete(`${environment.API_BASE}/residence/${residence.id}`)
  }

  addResidence(data: FormData): Observable<Object> {
    return this.http.post(`${environment.API_BASE}/residence`,data);
  }

  updateResidence(id: string,data: FormData): Observable<Object> {
    return this.http.put(`${environment.API_BASE}/residence/${id}`,data)
  }

  deleteImage(key: string): Observable<Object> {
    return this.http.delete(`${environment.API_BASE}/image/deleteimage`,{
      body: {
        Key: key
      }
    }).pipe(
      retry(3),
      catchError(this.handleError)
    )
  }

  getImage(key: string): Observable<Blob> {
    return this.http.get(`${environment.API_BASE}/image/getimages?key=${key}`,{responseType: 'blob'})
  }

  controlsConfig: {[p: string]: any} = {
    title:       [ '', [ Validators.required ] ],
    description: [ '', [ Validators.required ] ],
    category:    [ '', [ Validators.required ] ],
    address:     [ '', [ Validators.required ] ],
    city:        [ '', [ Validators.required ] ],
    country:     [ '', [ Validators.required ] ],
    zipCode:     [ '', [ Validators.required ] ],
    ownerName:   [ '', [ Validators.required ] ],
    email:       [ '', [ Validators.required, Validators.email ] ],
    price:       [ 0,  [ Validators.required, Validators.min(1) ,Validators.max(5000) ] ],
    status:      [ '', [ Validators.required ] ],
    phone:       [ '', [ Validators.required ] ]
  }

  constructor(private http: HttpClient,private loader: LoadingService) { }
}
