import {Injectable} from '@angular/core';
import {ComponentStore} from '@ngrx/component-store';
import {ResidenceType} from '../shared/interfaces/residence.type';
import {ResidencesService} from '../shared/services/residences.service';
import {combineLatest, EMPTY, Observable} from 'rxjs';
import {catchError, concatMap, exhaustMap, map, tap} from 'rxjs/operators';

interface ResidencesState {
  loading: boolean;
  residences: ResidenceType[];
  selectedResidenceId: string;
  selectedResidence: ResidenceType,
  filteredResidences: ResidenceType[];
}

const initialState: ResidencesState = {
  loading: false,
  residences: [],
  filteredResidences: [],
  selectedResidenceId: null,
  selectedResidence: null
}

@Injectable()
export class ResidencesStore extends ComponentStore<ResidencesState> {

  residences$: Observable<ResidenceType[]> = this.select(state => state.residences);
  selectedResidenceId$: Observable<string> = this.select(state => state.selectedResidenceId);
  selectedResidence$: Observable<ResidenceType> = this.select(this.residences$,this.selectedResidenceId$,
    (residences,selectedResidenceId) => residences.find((res) => res.id === selectedResidenceId))

  constructor(private residenceService: ResidencesService) {
    super(initialState);
  }

  init(): void {
    this.loadResidences();
  }

  onSelectResidence(residenceId: string): void {
    this.patchState({
      selectedResidenceId: residenceId
    })
  }

  loadResidences = this.effect((trigger$) => {
    return trigger$.pipe(
      exhaustMap(() => {
        return this.residenceService.residences$.pipe(
          tap((residences) => {
            this.setState((state) => {
              return {
                ...state,
                residences
              }
            })
          }),
          catchError((err) => EMPTY)
        )
      })
    )
  })

  addResidence = this.effect((residence$: Observable<FormData>) => {
    return residence$.pipe(
      concatMap((newResidence: FormData) =>
        this.residenceService.add(newResidence).pipe(
          tap((residence: ResidenceType) => {
            this.setState((state) => {
              return {
                ...state,
                residences: [...state.residences,residence]
              }
            })
          }),
          catchError((error) => EMPTY)
        ))
    )
  })

  updateResidence = this.effect((residence$: Observable<{residence: FormData,id: string}>) => {
    return residence$.pipe(
      concatMap((residence) => {
        return this.residenceService.updateResidence(residence.id,residence.residence).pipe(
          tap((updatedResidence: ResidenceType) => {
            this.setState(state => {
              return {
                ...state,
                residences: state.residences.map((res) => {
                  if (updatedResidence.id === res.id) {
                    return updatedResidence;
                  }
                  return res;
                })
              }
            })
          }),
          catchError(() => EMPTY)
        )
      })
    )
  })

  deleteResidence = this.effect((residence$: Observable<ResidenceType>) => {
    return residence$.pipe(
      concatMap((residence: ResidenceType) => {
        return this.residenceService.deleteResidence(residence).pipe(
          tap(() => {
            this.setState(state => {
              return {
                ...state,
                residences: state.residences.filter((res) => res.id !== residence.id)
              }
            })
          }),
          catchError(() => EMPTY)
        )
      })
    )
  })

}
