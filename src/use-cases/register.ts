import { hash } from 'bcryptjs'
import { OrganizationsRepository } from '@/repositories/interfaces/organizations-repository'
import { OrganizationAlreadyExists } from './errors/organization-already-exists-error'
import { Organization } from '@prisma/client'

interface RegisterUseCaseParams {
  name: string
  responsable_name: string
  email: string
  password: string
  address: string
  city: string
  postal_code: string
}

interface OrganizationRegisterUseCaseResponse {
  organization: Organization
}

export class RegisterUseCase {
  constructor(private organizationsRepository: OrganizationsRepository) {}

  async execute({
    name,
    responsable_name,
    email,
    password,
    address,
    city,
    postal_code,
  }: RegisterUseCaseParams): Promise<OrganizationRegisterUseCaseResponse> {
    const password_hash = await hash(password, 6)

    const organizationWithSameEmailOrName =
      await this.organizationsRepository.findByEmailOrName(email, name)

    if (organizationWithSameEmailOrName) {
      throw new OrganizationAlreadyExists()
    }

    const organization = await this.organizationsRepository.create({
      name,
      responsable_name,
      email,
      password_hash,
      address,
      city,
      postal_code,
    })

    return {
      organization,
    }
  }
}