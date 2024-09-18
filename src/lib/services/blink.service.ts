import { BlinkInterface } from '@/interfaces/models.interface'
import { nanoid } from 'nanoid'
import { apiResponse } from '../api.helpers'
import { supabaseClient } from '../supabase_client.utils'

export class BlinkService {
  /**
   * This TypeScript function retrieves a single record from a database table named 'blink' based on the
   * provided ID.
   * @param {string} id - The `getOneBlink` function is an asynchronous function that retrieves a single
   * record from a table named 'blink' based on the provided `id`. The function uses `supabaseClient` to
   * interact with the database and returns the fetched record along with an API response.
   * @returns The `getOneBlink` function is returning an API response object. If there is no error, it
   * returns an API response with a success status, a message of 'user details', and the details of the
   * blink object. If there is an error, it returns an API response with a failure status, a message of
   * 'failed to get blink information', and the error message.
   */
  static async getOneBlink(id: string) {
    try {
      const { data: blink, error } = await supabaseClient
        .from('blink')
        .select('*')
        .eq('id', id)

      if (error)
        return apiResponse(
          false,
          error?.message || 'failed to get blink information',
          error
        )

      return apiResponse<BlinkInterface | undefined>(
        true,
        'user details',
        blink![0]
      )
    } catch (error: unknown) {
        if(error instanceof Error) {
      console.log(`getUser: `, error?.message)
      return apiResponse(
        false,
        'failed to get blink information',
        error?.message
      )}
    }
  }

  /**
   * This TypeScript function fetches a list of users from a database using Supabase, with pagination
   * support.
   * @param {number} [page=0] - The `fetchBlinks` function is a static asynchronous function that fetches
   * a list of users from a database table named 'blink'. It accepts a `page` parameter, which is used to
   * determine the pagination of the results. The default value for `page` is 0.
   * @returns The `fetchBlinks` function is returning an API response object. If the operation is
   * successful, it returns an API response with a success status, a message indicating "user details",
   * and the fetched user data. If there is an error during the operation, it returns an API response
   * with a failure status, a message indicating "failed fetching user", and the error message
   * encountered during the operation.
   */
  static async fetchBlinks(page: number = 0) {
    const ITEMS_PER_PAGE = 20
    const from = page * ITEMS_PER_PAGE
    const to = from + ITEMS_PER_PAGE

    try {
      const { data: users, error } = await supabaseClient
        .from('blink')
        .select('*')
        .range(from, to)

      if (error)
        return apiResponse(false, error?.message || 'failed to get user', error)

      return apiResponse(true, 'user details', users)
    } catch (error: unknown) {
        if(error instanceof Error) {
      console.log(`getUser: `, error?.message)
      return apiResponse(false, 'failed fetching user', error?.message)
        }
    }
  }

  /**
   * This function creates a new "blink" entry in a database with specified user details if it does not
   * already exist.
   * @param payload - The `createBlink` function takes in a payload object with the following
   * parameters:
   * @returns The `createBlink` function returns an API response object. The response object contains a
   * boolean value indicating the success or failure of the operation, a message describing the result,
   * and additional data if applicable.
   */
  static async createBlink(payload: {
    user_id: string
    category_id: string
    title: string
    image_url?: string
    description?: string
    label?: string
    pub_key: string
  }) {
    try {
      const getBlink = await supabaseClient
        .from('blink')
        .select('*')
        .eq('title', payload.title)
        .eq('user_id', payload.user_id)
        .eq('category_id', payload.category_id)
        .eq('image_url', payload.image_url)
        .eq('description', payload.description)
        .eq('label', payload.label)
        .eq('pub_key', payload.pub_key)

      if (getBlink.error)
        return apiResponse(
          false,
          'user details',
          getBlink?.error?.message || 'something went wrong'
        )
      if (getBlink.data[0])
        return apiResponse(false, 'You already blink that', undefined)

      const { data: blink, error } = await supabaseClient
        .from('blink')
        .insert({ id: nanoid(20), ...payload })
        .select()

      if (error)
        return apiResponse(false, 'failed to save blink', error.message)

      return apiResponse(true, 'blink information', blink![0])
    } catch (error: unknown) {
        if(error instanceof Error) {
      console.log(`loginOrSignUp :`, error?.message)
      return apiResponse(false, 'failed saving user', error?.message)
        }
    }
  }

  /**
   * The function `updateBlink` in TypeScript updates a Blink record with the provided payload and
   * returns the updated information.
   * @param {string} id - The `id` parameter in the `updateBlink` function is a string that represents
   * the unique identifier of the Blink item that you want to update.
   * @param payload - The `payload` parameter in the `updateBlink` function contains the following
   * properties:
   * @returns The `updateBlink` function is returning an API response object with a success status, a
   * message, and the updated blink information. If there is an error during the update process, it
   * will return an API response object with a false status and an error message.
   */
  static async updateBlink(
    id: string,
    payload: {
      user_id: string
      title: string
      image_url?: string
      description?: string
      label?: string
      pub_key: string
    }
  ) {
    try {
      const getBlink = await BlinkService.getOneBlink(id)

      if (!getBlink?.success)
        return apiResponse(
          false,
          'user details',
          getBlink?.message || 'something went wrong'
        )
      if (!getBlink?.data)
        return apiResponse(false, 'Blink does not exist', undefined)

      const { data: user, error } = await supabaseClient
        .from('blink')
        .update({ ...payload })
        .eq('some_column', 'someValue')
        .select()

      if (error)
        return apiResponse(false, 'failed to update blink', error.message)

      return apiResponse(true, 'blink information', user)
    } catch (error: unknown) {
        if(error instanceof Error) {
      console.log(`updateBlink :`, error?.message)
      return apiResponse(false, 'failed updating blink', error?.message)
        }
    }
  }

  static async deleteBlink(id: string) {
    try {
      const { data: blink, error } = await supabaseClient
        .from('blink')
        .delete()
        .eq('id', id)

      if (error)
        return apiResponse(
          false,
          error?.message || 'failed to delete blink',
          error
        )

      return apiResponse(true, 'user details', blink![0])
    } catch (error: unknown) {
      if(error instanceof Error) {
      console.log(`getUser: `, error?.message)
      return apiResponse(
        false,
        'failed to delete blink information',
        error?.message
      )}
    }
  }
}
